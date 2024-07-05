import express from 'express';
const app = express();
import cors from 'cors';
import path from "path";
import cookieParser from 'cookie-parser';
import morgan from "morgan";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.use(cors({
  origin : process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended :true},{limit:"16kb"}));
app.use(express.static(path.join(__dirname,"public")));
app.use(cookieParser());
app.use(morgan("dev"));

//routes import
import indexRouter from './routes/indexRoutes.js';
import userRouter from "./routes/user.routes.js";

// routes declaration 
app.use("/",indexRouter);
app.use("/api/v1/users",userRouter);

export  {app};