import express, { Router } from 'express';
const app = express();
app.use(express.json());

import cors from 'cors';
app.use(cors());

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({
    path: path.resolve(__dirname, '../../../packages/Config/.env'),
});

import { MainRouter } from './routes/main';
app.use("/api/v1", MainRouter);

const port = process.env.HTTP_PORT;
app.listen(port);