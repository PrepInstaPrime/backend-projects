// This module was implemented by my friend Amlan Das Karmakar
// I only integrated it into the project
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import config from '../../config.mjs';

const s3 = new S3Client({
    region: config.region,
    credentials: {
        accessKeyId: config.accessKey,
        secretAccessKey: config.secretAccessKey
    }
});

const getS3ObjectKey = (profileImageValue) => {
    if (!profileImageValue) {
        return null;
    }

    try {
        const url = new URL(profileImageValue);
        const path = decodeURIComponent(url.pathname).replace(/^\//, '');

        if (!path) {
            return null;
        }

        if (path.startsWith(`${config.bucketName}/`)) {
            return path.slice(config.bucketName.length + 1);
        }

        return path;
    } catch {
        return profileImageValue;
    }
};

const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: [true, 'Street is required'],
        trim: true
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
    },
    pincode: {
        type: String,
        required: [true, 'Pincode is required'],
        validate: {
            validator: function (v) {
                return /^\d{6}$/.test(v);
            },
            message: 'Please provide a valid 6 digit pincode'
        }
    }
});

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lname: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email already exists'],
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Please provide a valid email'
        }
    },
    profileImage: {
        type: String,
        required: [true, 'Profile image is required']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: [true, 'Phone number already exists'],
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v);
            },
            message: 'Please provide a valid 10 digit Indian mobile number'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        maxlength: [15, 'Password cannot exceed 15 characters'],
        select: false
    },
    address: {
        shipping: addressSchema,
        billing: addressSchema
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    
    this.updatedAt = Date.now();
});

userSchema.post('findOne', async function (doc) {
    if (!doc?.profileImage) {
        return;
    }

    const objectKey = getS3ObjectKey(doc.profileImage);
    if (!objectKey) {
        return;
    }

    doc.profileImage = await getSignedUrl(
        s3,
        new GetObjectCommand({
            Bucket: config.bucketName,
            Key: objectKey
        }),
        { expiresIn: 3600 }
    );
});

const userModel = mongoose.model('users', userSchema);
export default userModel;