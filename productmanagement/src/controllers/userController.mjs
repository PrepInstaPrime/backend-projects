// This module was implemented by my friend Amlan Das Karmakar
// I only integrated it into the project
import userModel from '../models/userModel.mjs';
import bcrypt from 'bcrypt';
import { S3Client } from '@aws-sdk/client-s3';
import config from '../../config.mjs'
import multer from 'multer';
import multerS3 from 'multer-s3';
import { generateToken } from '../auth/authentication.mjs';

const s3 = new S3Client({
    region: config.region,
    credentials: {
        accessKeyId: config.accessKey,
        secretAccessKey: config.secretAccessKey
    }
});

const upload = multer({
    storage: multerS3({
        s3,
        bucket: config.bucketName,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            cb(null, `profile-pictures/${Date.now()}-${file.originalname}`);
        }
    })
});

const runProfileImageUpload = (req, res) => new Promise((resolve, reject) => {
    upload.fields([
        { name: 'profileImage', maxCount: 1 }
    ])(req, res, (error) => {
        if (error) {
            return reject(error);
        }
        resolve();
    });
});

const register = async (req, res) => {
    try {
        await runProfileImageUpload(req, res);

        const uploadedImage = req.files?.profileImage?.[0];
        
        if (uploadedImage?.key) {
            req.body.profileImage = uploadedImage.key;
        } else if (uploadedImage?.location) {
            req.body.profileImage = uploadedImage.location;
        }
        
        const user = await userModel.create(req.body);
        res.status(201).json({
            status: true,
            message: 'User registered successfully',
            data: user
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            message: error.message
        });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'User not found'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                status: false,
                message: 'Invalid credentials'
            });
        }

        const token = await generateToken(user._id.toString());
        
        res.status(200).json({
            status: true,
            message: 'Login successful',
            token: token
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            message: error.message
        });
    }
}

const getProfile = async (req, res) => {
    try {
        const userId = req.params.userId;

        if(userId !== req.userId) {
            return res.status(403).json({
                status: false,
                message: 'Unauthorized access'
            });
        }

        const user = await userModel.findById(userId).select('+password');

        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Profile retrieved successfully',
            data: user
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            message: error.message
        });
    }
}

const updateProfile = async (req, res) => {
    try {
        await runProfileImageUpload(req, res);

        const userId = req.params.userId;
        const allowedUpdates = ['fname', 'lname', 'email', 'profileImage', 'phone', 'password', 'address'];
        const updates = {};

        for (const key of allowedUpdates) {
            if (Object.prototype.hasOwnProperty.call(req.body, key)) {
                updates[key] = req.body[key];
            }
        }

        const uploadedImage = req.files?.profileImage?.[0];
        if (uploadedImage?.key) {
            updates.profileImage = uploadedImage.key;
        } else if (uploadedImage?.location) {
            updates.profileImage = uploadedImage.location;
        }

        if (typeof updates.address === 'string') {
            try {
                updates.address = JSON.parse(updates.address);
            } catch {
                delete updates.address;
            }
        }

        const user = await userModel.findByIdAndUpdate(userId, updates, { returnDocument: 'after' });

        res.status(200).json({
            status: true,
            message: 'Profile updated successfully',
            data: user
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            message: error.message
        });
    }
}
export { register, login, getProfile, updateProfile };