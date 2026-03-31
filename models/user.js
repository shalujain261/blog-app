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

userSchema.pre('save', function () {
    const user = this;
    // If password hasn't changed, do nothing
    if (!this.isModified('password')) return;

    const salt = randomBytes(16).toString('hex');
    const hashedPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest('hex');

    this.password = hashedPassword;
    this.salt = salt;
})

userSchema.static("matchPassword", async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error('User not found');

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHashPass = createHmac('sha256', salt).update(password)
        .digest('hex');

        if(hashedPassword !== userProvidedHashPass) throw new Error('Incorrect Username and password');

        return { ...user, password: undefined, salt: undefined }
})

const User = mongoose.model('User', userSchema);
module.exports = User;