import bcrypt from 'bcrypt';
import Users from '../models/userModel.mjs';
import { generateToken } from '../auth/authentication.mjs';

const register = async (req, res) => {
    try {
        const { title, name, phone, email, password, confirmPassword, address } = req.body;
        const newUser = await Users.create({ title, name, phone, email, password, confirmPassword, address });
        res.status(201).json({ status: true, data: { user: newUser } });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to create user', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Users.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ status: false, message: 'Invalid email or password' });
        }

        const token = generateToken(user._id);
        res.status(200).json({ status: true, data: { token } });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to login' });
    }
};

export { register, login };