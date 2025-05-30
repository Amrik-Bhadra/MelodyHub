const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    task: {
        type: String,
        enum: ['login', 'resetPassword'],
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Otp', otpSchema);
