import express, { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
const app = express();
app.use(express.json());

export const AuthMiddleware = (req: Request, res: Response, next: NextFunction): void => {
      
    const authHeader = req.headers['authorization'];
    if(!authHeader) {
         res.status(400).json({
            message: "authHeader is not provided"
        });
        return;
    }

    const token = authHeader.split(' ')[1];
    if(!token) {
         res.status(400).json({
            message: "token unavaliable"
        });
        return;
    }

    try {
        
        const jwtsecret = process.env.JWT_SECRET;
        if(!jwtsecret) {
             res.status(500).json({
                message: "JWT_SECRET not found"
            });
            return;
        }

        const decodedToken = jwt.verify(token, jwtsecret) as JwtPayload;
        if(!decodedToken) {
            res.status(401).send("Invalid token");
            return; 
        }
         
        req.userId = decodedToken.userId;
        next();

    } catch(e) {
         res.status(403).json({
            message: " unable to authorize "
        });
        return;
    }
} 