import dotenv from 'dotenv';

dotenv.config();
const config = {
    port: process.env.PORT || 8080,
    mongoURI: process.env.MongoDB,
    // JWTSecret: process.env.JWT_SECRET,
    JWTsecretToken: process.env.JWT_secretToken,
    accessKey: process.env.accessKey,
    secretAccessKey: process.env.secretAccessKey,
    region: process.env.region
};

export default config;