import {Schema, model} from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required and must be one of Mr, Mrs, Miss, Dr'],
            enum: ['Mr', 'Mrs', 'Miss', 'Dr']
        },
        name: {
            type: String,
            required: [true, 'Name is required']
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required and must be a valid 10-digit number'],
            unique: true,
            match: /^\d{10}$/
        },
        email: {
            type: String,
            required: [true, 'Email is required and must be a valid email address'],
            unique: true,
            lowercase: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        password: {
            type: String,
            required: [true, 'Password is required and must be between 8 and 15 characters'],
            minlength: 8,
            maxlength: 15
        },
        address: {
            street: String,
            city: String,
            pincode: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

userSchema.virtual('confirmPassword');

userSchema.pre('validate', function () {
    if (this.isModified('password') && this.password !== this.confirmPassword) {
        this.invalidate('confirmPassword', 'Password and confirm password do not match');
    }
});

userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }

    if (this.isModified()) {
        this.updatedAt = new Date();
    }
});

const User = model('User', userSchema);

export default User;