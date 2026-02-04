import express from 'express';
import Usage from '../models/Usage.js';

const router = express.Router();

// @route   POST /api/usage/log
// @desc    Log application entry
router.post('/log', async (req, res) => {
    const { userId, device } = req.body;

    try {
        const newEntry = new Usage({
            userId: userId || null,
            device: device || 'unknown'
        });

        await newEntry.save();

        const totalCount = await Usage.countDocuments();

        res.status(201).json({
            message: 'Usage logged successfully',
            totalVisits: totalCount
        });
    } catch (err) {
        console.error('Error logging usage:', err);
        res.status(500).json({ message: 'Error logging usage' });
    }
});

// @route   GET /api/usage/stats
// @desc    Get usage statistics
router.get('/stats', async (req, res) => {
    try {
        const totalCount = await Usage.countDocuments();
        res.json({ totalVisits: totalCount });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
});

export default router;
