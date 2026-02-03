import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    locationName: {
        type: String,
        required: true
    },
    nodeId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Ensure a user can't favorite the same place twice
favoriteSchema.index({ userId: 1, locationName: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);
export default Favorite;
