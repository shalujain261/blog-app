const mongoose = require('mongoose');
const {
    createHmac,
    randomBytes,
} = require('crypto');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    profileImageURL: {
        type: String,
        default: '/images/user.png'
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    }
}, { timestamps: true }
);

userSchema.pre('save', function (next) {
    const user = this;
    if (!this.isModified('password')) return;

    const salt = randomBytes(16).toString('hex');
    const hashedPassword = createHmac('sha256', salt)
    .update(user.password)
    .digest('hex');

    this.password = hashedPassword;
    this.salt = salt;
    next();
})

const User = mongoose.model('User', userSchema);
module.exports = User;