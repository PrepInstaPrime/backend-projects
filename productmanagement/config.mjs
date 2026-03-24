import dotenv from "dotenv";

dotenv.config();
const config = {
    port: process.env.PORT ||8080,
    mongoURI: process.env.mongoDB,
    jwtSecretToken: process.env.JWT_secretToken,
    accessKey: process.env.accessKey,
    secretAccessKey: process.env.secretAccessKey,
    region: process.env.region,
    bucketName: process.env.bucket
}

export default config;