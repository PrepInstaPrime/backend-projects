import userModel from "../models/userModel.mjs";
import {
  validateEmail,
  validatePassword,
  validatePhone,
} from "../utils/valid.mjs";
import bcrypt from "bcrypt";
import uploadFile from "../aws/uploadFile.mjs";
const registerUser = async (req, res) => {
  try {
    let { title, name, phone, email, password, address } = req.body;
    const { file } = req.file;

    // Required fields
    if (!title || !name || !phone || !email || !password || !file) {
      return res
        .status(400)
        .send({ status: false, message: "Missing required fields" });
    }

    // Title must be one of the allowed values
    const allowedTitles = ["Mr", "Mrs", "Miss"];
    if (!allowedTitles.includes(title)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid title value" });
    }

    // Validate format constraints
    if (!validateEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid email format" });
    }
    if (!validatePassword(password)) {
      return res.status(400).send({
        status: false,
        message: "Password must meet the required rules (8-15 chars)",
      });
    }
    if (!validatePhone(phone)) {
      return res.status(400).send({
        status: false,
        message: "Phone number must be 10 digits long",
      });
    }

    // Check for duplicate email or phone
    const existingUser = await userModel.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingUser) {
      return res
        .status(400)
        .send({ status: false, message: "Email or phone already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const profileImageUrl = await uploadFile(file);
    if (!profileImageUrl) {
      return res
        .status(500)
        .send({ status: false, message: "Failed to upload profile image" });
    }
    const newUser = await userModel.create({
      title,
      name,
      phone,
      email,
      password: hashedPassword,
      address,
      profileImage: profileImageUrl,
    });
    return res.status(201).send({ status: true, data: newUser });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).send({ status: false, message: error.message });
    }
    if (error.code === 11000) {
      return res
        .status(400)
        .send({ status: false, message: "Duplicate key error" });
    }
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).send({ status: false, message: "User not found" });
    }
    return res.status(200).send({ status: true, data: user });
  } catch (error) {
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

export { registerUser, getUser };
