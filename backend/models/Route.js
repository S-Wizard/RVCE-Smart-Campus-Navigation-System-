import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        default: 'Untitled Route'
    },
    start: {
        type: String,
        required: true
    },
    end: {
        type: String,
        required: true
    },
    path: {
        type: [String], // Array of node IDs
        required: true
    }
}, {
    timestamps: true
});

const Route = mongoose.model('Route', routeSchema);
export default Route;
