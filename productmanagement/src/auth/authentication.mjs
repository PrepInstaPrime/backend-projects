// This module was implemented by my friend Amlan Das Karmakar 
// I only integrated it into the project
import jwt from 'jsonwebtoken';
import config from '../../config.mjs';

const generateToken = async (userId) => {
    try {
        const payload = {
            userId: userId,
        };
        return jwt.sign(payload, config.jwtSecretToken, { expiresIn: '1h' });
    } catch (error) {
        throw new Error('Error generating token');
    }
}

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ status: false, message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecretToken);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ status: false, message: 'Invalid token' });
    }
}

export { generateToken, verifyToken };