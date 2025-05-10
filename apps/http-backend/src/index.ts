import express, { Router } from 'express';
const app = express();
app.use(express.json());

import cors from 'cors';
app.use(cors({origin: ["http://13.233.131.120",
   "http://localhost:3000"],
   credentials: true}));

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({
    path: path.resolve(__dirname, '../../../packages/Config/.env'),
});

import { MainRouter } from './routes/main';
app.use("/api/v1", MainRouter);

const port = process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT, 10) : 3001;
if (isNaN(port) || port < 0 || port >= 65536) {
  console.error(`Invalid port: ${process.env.HTTP_PORT}. Using default port 3001.`);
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});