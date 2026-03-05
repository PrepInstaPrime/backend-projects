import dotenv from "dotenv";
dotenv.config();
const config = {
  mongoURI: process.env.MONGODB_URI,
  port: process.env.PORT || 8080,
  jwtSecret: process.env.JWT_SECRET,
  accessKey: process.env.Access_key,
  secretAccessKey: process.env.Secret_access_key,
  region: process.env.region,
};
export default config;
