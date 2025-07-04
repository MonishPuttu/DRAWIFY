import bcrypt from 'bcrypt';
import { SignupValidation, signinValidation, roomValidations } from '@repo/common';
import express, { Router } from 'express';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prismaClient } from '@repo/database';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
const app = express();
app.use(express.json());

export const UserRouter: Router = express.Router();

UserRouter.post("/signup", async(req: Request, res: Response) => {

    const { success, data, error } = SignupValidation.safeParse(req.body);

    if(!success) {
            res.status(400).json({
            message: "Incorrect inputs",
            errors: error.errors 
        }); 
        return;
    }

    const { username, email, password } = data;

    try {
        const existingUser = await prismaClient.user.findUnique({where: {username}});
    
        if(existingUser) {
                res.status(400).json({
                message: "User already exists"
            });
            return;
        }

        const hashedpassword = await bcrypt.hash(password, 10);
    
        await prismaClient.user.create({
            data: {username, email, password: hashedpassword}
        });

        res.status(201).json({
            message: "User has been created successfully"
        });
        return;

    } catch(e) {

        console.log("error during signup", e);
        res.status(500).json({
            message: "sever not responding"
        });
        return;
    }
});

UserRouter.post("/signin", async(req: Request, res: Response) => {

    const { success, data, error } = signinValidation.safeParse(req.body);
    
    if(!success) {
        res.status(400).json({
            message: "Incorrect inputs",
            errors: error.errors
        });
        return;
    } 

    const { username, password } = data;

    try{
        const existingUser = await prismaClient.user.findUnique({where: {username}});
    
        if(!existingUser) {
            res.status(401).json({
               message: "User does not exist"
           });
           return;
        }
    
        const storedhash = existingUser.password;
        const verifiedpassword = await bcrypt.compare(password, storedhash);

        if(!verifiedpassword) {
            res.status(401).json({ 
                message: "Invalid credentials"
            });
            return;
        }

        const userId = existingUser.id;
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            res.status(401).json({
                message: "Jwt_Secret not found"
            });
            return;
        }   
    
        const token = jwt.sign({userId}, jwtSecret);

            res.status(202).json({
                message: "User has been signed in",
                token: token
            });
            return;

    } catch(e) {

        console.log("error while signin", e);
        res.status(500).json({
            message: "server not responding"
        });
        return;
    } 
    
});

UserRouter.post("/room", AuthMiddleware, async(req: Request, res: Response) => {

    const { success, data, error } = roomValidations.safeParse(req.body);

    if(!success) {
        console.log("Validation Error:", error);
        res.json({
            message: "Incorrect Inputs"
        })
        return;
    }
    
    const slug = data.slug;
    const adminId = req.userId;

    if(!adminId) {
        res.status(400).json({
            message: "incorrect adminId"
        })
        return;
    }
    
    try {
        const room = await prismaClient.room.create({
            data: {
                slug,
                adminId
            }
        })
    
        res.status(200).json({
            roomId: room.id
        })
    } catch(e) {
        res.status(411).json({
            message: "Room already exists"
        });
        return;
    }
    
});

UserRouter.get("/chats/:roomId", async(req: Request, res: Response) => {
    try {
        const roomId = Number(req.params.roomId);
        const messages = await prismaClient.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: "desc"
            },
            take: 1000
        });

        res.json({
            messages
        })

    } catch(e) {
        console.log(e);
        res.json({
            messages: []
        })
    }
})

UserRouter.get("/room/:slug", async (req: Request, res: Response) => {
    const slug = req.params.slug;

    if (!slug) {
        res.status(400).json({ message: "Room slug is required" });
        return;
    }

    const room = await prismaClient.room.findFirst({
        where: {
            slug
        }
    });

    if (!room) {
        res.status(404).json({ message: "Room not found" });
        return;
    }

    res.json({
        roomId: room.id
    });
});