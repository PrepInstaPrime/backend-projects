import express from "express";
import mongoose from "mongoose";
import config from "./config.mjs";
import router from "./src/route.mjs";
import multer from "multer";
const app = express();
app.use(multer().any());
app.use(express.json());
mongoose
  .connect(config.mongoURI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
app.use("/", router);
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
