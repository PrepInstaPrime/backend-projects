import express from "express";
import dotenv from "dotenv";

import { connectDB } from "./src/config/db.mjs";
import routes from "./src/routes.mjs";

dotenv.config();

const app = express();

app.use(express.json());

connectDB();

app.use("/", routes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
