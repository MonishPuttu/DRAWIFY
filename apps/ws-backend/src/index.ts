import { prismaClient } from '@repo/database/client';
import WebSocket, { Server } from 'ws';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({
    path: path.resolve(__dirname, '../../../packages/Config/.env'),
});
const port = Number(process.env.WS_PORT);
const jwtSecret = process.env.JWT_SECRET || "";

interface User {
    ws: WebSocket,
    rooms: string[],
    userId: string
}

interface ChatMessage {
    roomId: number,
    message: string,
    userId: string
}

class WsServer {
    private static instance: WsServer;
    private wss: Server;
    private users: User[] = [];
    private messagesQueue: ChatMessage[] = [];
    private isProcessingQueue: boolean = false;


    private constructor() {
        this.wss = new WebSocket.Server({ port });
        this.initialize();
    }

    public static getInstance(): WsServer {
        if(!WsServer.instance) {
            WsServer.instance = new WsServer();
        }
        return WsServer.instance;
    }

    private checkUser(token: string): string | null {
        try {
            const decoded = jwt.verify(token, jwtSecret);
            if(typeof decoded === "string" || !decoded?.userId) {
                return null;
            }
            return decoded.userId;
        } catch(e) {
            return null;
        }
    }

    private initialize() {
        this.wss.on('connection', (ws, request) => {
            const url = request.url;
            if(!url) {
                return;
            }

            const queryParams = new URLSearchParams(url.split('?')[1]);
            const token = queryParams.get('token') || "";
            const userId = this.checkUser(token);

            if(!userId) {
                ws.close();
                return;
            }

            const user: User = { userId, rooms:[], ws};
            this.users.push(user);

            ws.on('message', async (data) => {
                let parsedData = typeof data !== "string" ? JSON.parse(data.toString()) : JSON.parse(data);

                if (parsedData.type === "join_room") {
                    user.rooms.push(parsedData.roomId);
                } else if (parsedData.type === "leave_room") {
                    user.rooms = user.rooms.filter(x => x !== parsedData.roomId);
                } else if (parsedData.type === "chat") {

                    this.messagesQueue.push({
                        roomId: Number(parsedData.roomId),
                        message: parsedData.message,
                        userId
                    });

                    this.processQueue();

                    this.users.forEach(u => {
                        if (u.rooms.includes(parsedData.roomId)) {
                            u.ws.send(JSON.stringify({
                                type: "chat",
                                message: parsedData.message, 
                                roomId: parsedData.roomId 
                            }))
                        }
                    })
                }
            })
        })
    }

    private async processQueue() {
        if (this.isProcessingQueue) 
            return;
        this.isProcessingQueue = true;
        
        while (this.messagesQueue.length > 0) {
            const chatMessage = this.messagesQueue.shift();
            if (!chatMessage) 
                continue;

            try {
                await prismaClient.chat.create({
                    data: {
                        roomId: chatMessage.roomId,
                        message: chatMessage.message,
                        userId: chatMessage.userId
                    }
                })
            } catch(e) {
                console.error(e);
            }
        }
        this.isProcessingQueue = false;
    }
}

WsServer.getInstance();
