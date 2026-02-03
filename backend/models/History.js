import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
        type: [String],
        required: true
    }
}, {
    timestamps: true
});

const History = mongoose.model('History', historySchema);
export default History;
