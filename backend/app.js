import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoute from './routes/auth.routes.js';
import userRoute from './routes/user.routes.js';
import storeRoute from './routes/storeOwner.routes.js';
import adminRoute from './routes/admin.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/owner", storeRoute);
app.use("/api/v1/admin", adminRoute);

export { app };
