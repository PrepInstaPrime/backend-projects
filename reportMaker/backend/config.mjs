import dotenv from "dotenv";
dotenv.config();

export const config = {
    port: process.env.PORT,
    mongoDB: process.env.mongoDB,
    secretMessage: process.env.secretMessage,
};