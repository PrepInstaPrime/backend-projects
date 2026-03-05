import jwt from "jsonwebtoken";
import config from "../../config.mjs";

const authenticateToken = (req, res, next) => {
  try {
    const authHeader =
      req.headers["authorization"] || req.headers["Authorization"];
    if (!authHeader) {
      return res
        .status(401)
        .send({
          status: false,
          message: "Please login to access this resource",
        });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
      return res
        .status(401)
        .send({
          status: false,
          message: "Invalid authorization header format",
        });
    }

    const token = parts[1];
    jwt.verify(token, config.secretToken, (err, decodedToken) => {
      if (err) {
        return res
          .status(401)
          .send({ status: false, message: "Invalid or expired token" });
      }
      req.user = decodedToken;
      next();
    });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

export { authenticateToken };
