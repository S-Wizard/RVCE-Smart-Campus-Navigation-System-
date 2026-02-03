import express from 'express';
import Route from '../models/Route.js';
import Favorite from '../models/Favorite.js';
import History from '../models/History.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authMiddleware to all routes here
router.use(authMiddleware);

/* ================= SAVED ROUTES ================= */

router.post('/routes/save', async (req, res) => {
    const { name, start, end, path } = req.body;
    try {
        const newRoute = new Route({
            userId: req.user.id,
            name,
            start,
            end,
            path
        });
        await newRoute.save();
        res.status(201).json(newRoute);
    } catch (err) {
        res.status(500).json({ message: 'Error saving route' });
    }
});

router.get('/routes', async (req, res) => {
    try {
        const routes = await Route.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(routes);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching routes' });
    }
});

router.delete('/routes/:id', async (req, res) => {
    try {
        await Route.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        res.json({ message: 'Route deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting route' });
    }
});

/* ================= FAVORITES ================= */

router.post('/favorites/add', async (req, res) => {
    const { locationName, nodeId } = req.body;
    try {
        const favorite = new Favorite({
            userId: req.user.id,
            locationName,
            nodeId
        });
        await favorite.save();
        res.status(201).json(favorite);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Already in favorites' });
        }
        res.status(500).json({ message: 'Error adding favorite' });
    }
});

router.get('/favorites', async (req, res) => {
    try {
        const favorites = await Favorite.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(favorites);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching favorites' });
    }
});

router.delete('/favorites/:locationName', async (req, res) => {
    try {
        await Favorite.findOneAndDelete({
            userId: req.user.id,
            locationName: req.params.locationName
        });
        res.json({ message: 'Favorite removed' });
    } catch (err) {
        res.status(500).json({ message: 'Error removing favorite' });
    }
});

/* ================= HISTORY ================= */

router.post('/history/add', async (req, res) => {
    const { start, end, path } = req.body;
    try {
        const entry = new History({
            userId: req.user.id,
            start,
            end,
            path
        });
        await entry.save();

        // Optional: Keep only last 10 entries
        const historyCount = await History.countDocuments({ userId: req.user.id });
        if (historyCount > 10) {
            const oldest = await History.findOne({ userId: req.user.id }).sort({ createdAt: 1 });
            if (oldest) await History.findByIdAndDelete(oldest._id);
        }

        res.status(201).json(entry);
    } catch (err) {
        res.status(500).json({ message: 'Error adding to history' });
    }
});

router.get('/history', async (req, res) => {
    try {
        const history = await History.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching history' });
    }
});

router.delete('/history', async (req, res) => {
    try {
        await History.deleteMany({ userId: req.user.id });
        res.json({ message: 'History cleared' });
    } catch (err) {
        res.status(500).json({ message: 'Error clearing history' });
    }
});

export default router;
