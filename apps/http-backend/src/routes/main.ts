import { UserRouter } from './user';
import express, { Router } from "express";
export const MainRouter: Router = express.Router();

MainRouter.use("/user", UserRouter)