import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import path from "path"
import cookieParser from 'cookie-parser';

import indexRouter from './routes/indexRoutes.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.use(cors({
  origin : process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended :true},{limit:"16kb"}));
app.use(express.static(path.join(__dirname,"public")));
app.use(cookieParser());


app.use("/",indexRouter);

export default app;