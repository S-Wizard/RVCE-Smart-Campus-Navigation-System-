import { road, buildingConnectors } from "../data/graph";

/**
 * Calculate the angle between three points (p1 -> p2 -> p3).
 * Returns angle in degrees. 
 * Negative: Left turn
 * Positive: Right turn
 * Near 0: Straight
 */
function getTurnType(p1, p2, p3) {
    const v1 = { x: p2.x - p1.x, y: p2.y - p1.y };
    const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };

    // Angle of vectors
    const angle1 = Math.atan2(v1.y, v1.x);
    const angle2 = Math.atan2(v2.y, v2.x);

    let diff = angle2 - angle1;

    // Normalize to -PI to +PI
    while (diff <= -Math.PI) diff += 2 * Math.PI;
    while (diff > Math.PI) diff -= 2 * Math.PI;

    const deg = diff * (180 / Math.PI);

    if (Math.abs(deg) < 25) return "straight";
    if (deg < -25) return "left";
    return "right";
}

export function generateInstructions(path) {
    if (!path || path.length < 2) return [];

    const instructions = [];

    // 1. Map nodes to buildings for landmarks
    const nodeToBuilding = {};
    buildingConnectors.forEach(c => {
        nodeToBuilding[c.to.id] = c.building;
    });

    // Start Instruction
    const startId = path[0];
    const startName = nodeToBuilding[startId] || `Road ${startId}`;
    instructions.push({
        id: "start",
        icon: "start",
        text: `Start at ${startName}`
    });

    let i = 0;
    while (i < path.length - 1) {
        const currentId = path[i];
        const nextId = path[i + 1];

        // Check if we have a 3rd point to detect a turn
        if (i + 2 < path.length) {
            const futureId = path[i + 2];

            const p1 = road[currentId];
            const p2 = road[nextId];
            const p3 = road[futureId];

            const turn = getTurnType(p1, p2, p3);
            const landmark = nodeToBuilding[nextId]; // Landmark at the turning point

            if (turn !== "straight") {
                // It's a turn!
                const direction = turn === "left" ? "Turn Left" : "Turn Right";
                let text = `${direction}`;
                if (landmark) text += ` at ${landmark}`;

                instructions.push({
                    id: nextId,
                    icon: turn === "left" ? "arrow-left" : "arrow-right",
                    text: text
                });

                i++; // Move to next segment
                continue;
            }
        }

        // If straight or end of path segment processing
        // Accumulate straights? For now, we only push "Head Straight" if it's a long segment or we just started/turned.
        // To keep it simple for the MVP + User Request:
        // If we are just moving straight, maybe say "Pass by [Landmark]" if exists?

        const landmark = nodeToBuilding[nextId];
        if (landmark) {
            instructions.push({
                id: nextId + "-pass",
                icon: "arrow-up",
                text: `Go straight past ${landmark}`
            });
        } else {
            // Logic to avoid spamming "Go Straight" for every road node.
            // Only show if previous instruction was NOT a straight instruction? 
            // Or just consolidate.

            const last = instructions[instructions.length - 1];
            if (!last || !last.text.startsWith("Go straight")) {
                instructions.push({
                    id: nextId + "-straight",
                    icon: "arrow-up",
                    text: "Go straight"
                });
            }
        }

        i++;
    }

    // Destination
    const endId = path[path.length - 1];
    const endName = nodeToBuilding[endId] || `Destination`;
    instructions.push({
        id: "end",
        icon: "destination",
        text: `Arrive at ${endName}`
    });

    return consolidateInstructions(instructions);
}

// Helper to merge consecutive "Go straight"s
function consolidateInstructions(list) {
    const merged = [];

    list.forEach(item => {
        const last = merged[merged.length - 1];

        if (last && last.text === "Go straight" && item.text === "Go straight") {
            // Skip duplicate simple straights
            return;
        }

        // If last was "Go straight" and this is "Go straight past X", replace last?
        if (last && last.text === "Go straight" && item.text.startsWith("Go straight past")) {
            merged[merged.length - 1] = item;
            return;
        }

        merged.push(item);
    });

    return merged;
}
