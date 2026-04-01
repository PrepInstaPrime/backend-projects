import userModel from "../models/userModel.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../../config.mjs";
const registerUser = async (req, res) => {
   try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({ name, email, password: hashedPassword, role });
    return res.status(201).send({ message: "User created successfully", user });
   } catch (error) {
     if(error.message.includes("duplicate")){
        return res.status(400).send({ message: "User already exists" });
     }else if(error.message.includes("validation")){
        return res.status(400).send({ message: "Validation failed", error: error.message });
     }else{
        return res.status(500).send({ message: "Internal server error" });
     }
   }
};

const loginUser = async (req, res) => {
   try {
     const { email, password } = req.body;
     const user = await userModel.findOne({ email });
     if(!user){
        return res.status(400).send({ message: "User not found" });
     }
     const isPasswordCorrect = await bcrypt.compare(password, user.password);
     if(!isPasswordCorrect){
        return res.status(400).send({ message: "Invalid password" });
     }
     const token = jwt.sign({ userId: user._id, role: user.role }, config.secretMessage, { expiresIn: "24h" });
     res.setHeader("Authorization", `Bearer ${token}`);
     return res.status(200).send({ message: "Login successful", user });
   } catch (error) {
     return res.status(500).send({ message: "Internal server error" });
   }
};

const getUser = async (req, res) => {
   try {
     const { userId } = req.params;
     const user = await userModel.findById(userId);
     return res.status(200).send({ message: "User found", user });
   } catch (error) {
     return res.status(500).send({ message: "Internal server error" });
   }
};
const updateUser = async (req, res) => {
   try {
     const { userId } = req.params;
     const { name, email, password, role } = req.body;
     const hashedPassword = await bcrypt.hash(password, 10);
     const user = await userModel.findByIdAndUpdate(userId, { name, email, password: hashedPassword, role }, { new: true });
     return res.status(200).send({ message: "User updated successfully", user });
   } catch (error) {
     if(error.message.includes("user not found")){
        return res.status(400).send({ message: "User not found" });
     }else if(error.message.includes("validation")){
        return res.status(400).send({ message: "Validation failed", error: error.message });
     }else{
        return res.status(500).send({ message: "Internal server error" });
     }
   }
};
export { registerUser, loginUser, getUser, updateUser };