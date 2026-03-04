import jwt from "jsonwebtoken";
import config from "../../config.mjs";

const secretKey = config.JWTSecret || "your_secret_key";

const generateToken = (id) => {
  const payload = {
    id: id,
  };
  return jwt.sign(payload, secretKey, { expiresIn: "1w" });
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ status: false, message: "You need to be logged in" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, message: "Invalid token. Please log in again." });
  }
};

export { generateToken, verifyToken };
