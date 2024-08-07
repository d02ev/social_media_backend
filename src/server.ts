import 'dotenv/config';

import express, { Application, json, urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { ServerConfig } from './configs';
import passport from 'passport';
import { errorHandler } from './middlewares';

const app: Application = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(cookieParser());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(passport.initialize());

app.use(errorHandler);

const PORT = parseInt(process.env.PORT!) || 3000;
new ServerConfig(PORT, app).initServer();