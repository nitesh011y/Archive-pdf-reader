import express from "express";
import cors from "cors";
import "dotenv/config";
import fileRoute from "./routes/file.route.js";
import UserRouter from "./routes/user.router.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/files", fileRoute);
app.use("/users", UserRouter);

export default app;
