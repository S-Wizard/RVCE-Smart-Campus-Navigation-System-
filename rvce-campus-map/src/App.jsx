import { useState, useEffect, useMemo } from "react";
import SearchPanel from "./components/SearchPanel";
import SearchBar from "./components/SearchBar";
import MapView from "./components/MapView";
import DirectionsPanel from "./components/DirectionsPanel";
import AuthModal from "./components/AuthModal";
import ProfileDropdown from "./components/ProfileDropdown";
import LandingScreen from "./components/LandingScreen";
import "./App.css";

import { gpsToMap } from "./data/gps";
import {
  road,
  graph,
  dijkstra,
  buildingConnectors
} from "./data/graph";

export default function App() {
  const [routeRequest, setRouteRequest] = useState(null);
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [userPos, setUserPos] = useState(null);

  /* ================= AUTH STATE ================= */
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  /* ================= USER DATA STATE ================= */
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [isRouteSaved, setIsRouteSaved] = useState(false);
  const [hasEntered, setHasEntered] = useState(() => {
    return sessionStorage.getItem('hasEntered') === 'true';
  });

  const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

  const logUsage = async () => {
    try {
      const device = window.innerWidth < 768 ? 'mobile' : 'desktop';
      await fetch(`${apiUrl}/api/usage/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || null,
          device
        })
      });
    } catch (err) {
      console.error('Error logging usage:', err);
    }
  };

  const handleEnter = () => {
    setHasEntered(true);
    sessionStorage.setItem('hasEntered', 'true');
    logUsage();
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Restore user from token (simplified: in a real app, fetch /profile)
      const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      fetch(`${apiUrl}/api/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.username) {
            setUser(data);
            fetchUserData(token);
          } else {
            localStorage.removeItem('token');
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
        });
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [routesRes, favsRes, historyRes] = await Promise.all([
        fetch(`${apiUrl}/api/user/routes`, { headers }),
        fetch(`${apiUrl}/api/user/favorites`, { headers }),
        fetch(`${apiUrl}/api/user/history`, { headers })
      ]);

      if (routesRes.ok) setSavedRoutes(await routesRes.json());
      if (favsRes.ok) setFavorites(await favsRes.json());
      if (historyRes.ok) setHistory(await historyRes.json());
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsProfileOpen(false);
    setSavedRoutes([]);
    setFavorites([]);
    setHistory([]);
  };

  /* ================= USER ACTIONS ================= */

  const handleSaveRoute = async () => {
    if (!user || path.length === 0) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${apiUrl}/api/user/routes/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: `${routeRequest.start} to ${routeRequest.end}`,
          start: routeRequest.start,
          end: routeRequest.end,
          path: path
        })
      });
      if (response.ok) {
        setIsRouteSaved(true);
        fetchUserData(token);
      }
    } catch (err) {
      console.error('Save route error:', err);
    }
  };

  const handleToggleFavorite = async (location) => {
    if (!user) return;
    const token = localStorage.getItem('token');
    const isFav = favorites.some(f => f.locationName === location.name);

    try {
      const response = await fetch(`${apiUrl}/api/user/favorites/${isFav ? location.name : 'add'}`, {
        method: isFav ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: isFav ? null : JSON.stringify({
          locationName: location.name,
          nodeId: location.id
        })
      });
      if (response.ok) fetchUserData(token);
    } catch (err) {
      console.error('Toggle favorite error:', err);
    }
  };

  const handleLoadRoute = (savedPath) => {
    setPath(savedPath);
    setStartNode(savedPath[0]);
    setEndNode(savedPath[savedPath.length - 1]);
    setRouteRequest({
      start: savedPath[0], // Simplified: nodes are named items in graph
      end: savedPath[savedPath.length - 1]
    });
  };

  const logHistory = async (newPath) => {
    if (!user || newPath.length === 0) return;
    const token = localStorage.getItem('token');
    try {
      await fetch(`${apiUrl}/api/user/history/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          start: routeRequest.start,
          end: routeRequest.end,
          path: newPath
        })
      });
      fetchUserData(token);
    } catch (err) {
      console.error('Log history error:', err);
    }
  };

  /* ================= GPS LOGIC ================= */
  useEffect(() => {
    if (!gpsEnabled) return;

    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        setUserPos(gpsToMap(latitude, longitude));
      },
      err => {
        console.error("GPS error:", err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [gpsEnabled]);

  /* ================= ROUTE CALCULATION ================= */
  const { path, startNode, endNode } = useMemo(() => {
    if (!routeRequest) return { path: [], startNode: null, endNode: null };

    // Helper to find nearest node
    const findNearestNode = (pos) => {
      let min = Infinity;
      let nearest = null;
      Object.values(road).forEach(n => {
        const d = Math.sqrt(Math.pow(n.x - pos.x, 2) + Math.pow(n.y - pos.y, 2));
        if (d < min) {
          min = d;
          nearest = n.id;
        }
      });
      return nearest;
    };

    const getRoadForBuilding = (name) => {
      const c = buildingConnectors.find(b => b.building === name);
      return c ? c.to.id : null;
    };

    // Handle Start Node
    let s;
    if (routeRequest.start === "Current Location") {
      if (userPos) {
        s = findNearestNode(userPos);
      } else {
        s = null;
      }
    } else {
      s = getRoadForBuilding(routeRequest.start);
    }

    const e = getRoadForBuilding(routeRequest.end);

    if (!s || !e) return { path: [], startNode: null, endNode: null };

    return {
      path: dijkstra(graph, s, e),
      startNode: s,
      endNode: e
    };
  }, [routeRequest, userPos]);

  // UI State
  const [isSearchOpen, setIsSearchOpen] = useState(true);

  function handleFindPath(start, end) {
    if (!start || !end) return;
    setIsRouteSaved(false); // New route, reset save state
    setRouteRequest({ start, end });
    if (window.innerWidth < 768) {
      setIsSearchOpen(false);
    }
  }

  // Automatic History Logging
  useEffect(() => {
    if (path && path.length > 0) {
      logHistory(path);
    }
  }, [path]);

  function handleSelectPlace(name, type) {
    const current = routeRequest || { start: "", end: "" };
    const newReq = { ...current, [type]: name };
    setRouteRequest(newReq);

    // Auto-nav if both are present
    if (newReq.start && newReq.end) {
      handleFindPath(newReq.start, newReq.end);
    }
  }

  function handleResetAll() {
    setRouteRequest(null);
    setIsSearchOpen(true);
  }

  if (!hasEntered) {
    return <LandingScreen onEnter={handleEnter} />;
  }

  return (
    <div className="app-layout">
      <SearchBar
        onSelectPlace={handleSelectPlace}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={(u) => setUser(u)}
        />
      )}

      {isProfileOpen && user && (
        <ProfileDropdown
          user={user}
          onLogout={handleLogout}
          onClose={() => setIsProfileOpen(false)}
          savedRoutes={savedRoutes}
          favorites={favorites}
          history={history}
          onLoadRoute={handleLoadRoute}
          onDeleteRoute={async (id) => {
            const token = localStorage.getItem('token');
            await fetch(`${apiUrl}/api/user/routes/${id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchUserData(token);
          }}
          onDeleteFavorite={handleToggleFavorite}
          onClearHistory={async () => {
            const token = localStorage.getItem('token');
            await fetch(`${apiUrl}/api/user/history`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchUserData(token);
          }}
        />
      )}

      <SearchPanel
        start={routeRequest?.start || ""}
        end={routeRequest?.end || ""}
        onUpdateRoute={(field, value) => handleSelectPlace(value, field)}
        onFindPath={handleFindPath}
        isOpen={isSearchOpen}
        setIsOpen={setIsSearchOpen}
      />

      {path.length > 0 && (
        <DirectionsPanel
          path={path}
          onClose={() => {
            setRouteRequest(null);
            setIsSearchOpen(true);
            setIsRouteSaved(false);
          }}
          user={user}
          onSaveRoute={handleSaveRoute}
          routeName={isRouteSaved ? "Saved" : null}
        />
      )}

      <MapView
        gpsEnabled={gpsEnabled}
        setGpsEnabled={setGpsEnabled}
        userPos={userPos}
        path={path}
        startNode={startNode}
        endNode={endNode}
        onResetAll={handleResetAll}
        onSelectPlace={handleSelectPlace}
        user={user}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
}

