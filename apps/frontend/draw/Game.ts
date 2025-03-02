
import { Viewport } from './ViewPort';
import { Tool } from './../components/Canvas';
import { getExistingShapes } from "../draw/http";
import { v4 as uuidv4 } from 'uuid';

type Shape = {
    id: string;
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    id: string;
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
} | {
    id: string;
    type: "pencil";
    points: { x: number, y: number} [];
}

export class Game {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[]
    private roomId: string;
    private clicked: boolean;
    private startX = 0;
    private startY = 0;
    private selectedTool: Tool = "circle";
    private PencilPoints: { x:number, y:number }[] = [];
    socket: WebSocket;
    Viewport: Viewport;

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket, viewport: Viewport) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        this.Viewport = viewport

        this.Viewport.onZoomChange = () => {
            this.clearCanvas();
        }

        this.init();
        this.initHandlers();
        this.initMouseHandlers();
        
    }
    
    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler)

        this.canvas.removeEventListener("mouseup", this.mouseUpHandler)

        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
    }

    setTool(tool: "circle" | "pencil" | "rect") {
        this.selectedTool = tool;
        this.clearCanvas();
    }

    async init() {
        this.existingShapes = await getExistingShapes(this.roomId);
        console.log(this.existingShapes);
        this.clearCanvas();
    }

    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.type == "chat") {
                const parsedShape = JSON.parse(message.message);
                const exists = this.existingShapes.some(s => s.id === parsedShape.shape.id);
                if (!exists) {
                    this.existingShapes.push(parsedShape.shape);
                    this.clearCanvas();
                }
            }
        }
    }

    clearCanvas() {

       const pan = this.Viewport.getOffset();

       this.ctx.setTransform(
        1 / this.Viewport.zoom, 0,
        0, 1 / this.Viewport.zoom,
        this.Viewport.center.x + pan.x,
        this.Viewport.center.y + pan.y
       );
        this.ctx.save();

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0, 0, 0)"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.restore();

        this.existingShapes.forEach((shape) => {
            if (shape.type === "rect") {
                this.ctx.strokeStyle = "rgba(255, 255, 255)"
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === "circle") {
                this.ctx.strokeStyle = "rgba(255, 255, 255)";
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();                
            } else if (shape.type === "pencil") {
                if (!shape.points || shape.points.length === 0) {
                    return;
                }
                this.ctx.strokeStyle = "rgba(255, 255, 255)";
                this.ctx.beginPath();
                this.ctx.moveTo(shape.points[0]!.x, shape.points[0]!.y);
                for (let i= 1; i< shape.points.length; i++) {
                    this.ctx.lineTo(shape.points[i]!.x, shape.points[i]!.y);
                }
                this.ctx.stroke();
            }
        });
    }

    mouseDownHandler = (e: MouseEvent) => {
        if (e.button !== 0) return;

        const { x, y } = this.Viewport.getMouse(e);
        this.clicked = true
        this.startX = x
        this.startY = y

        if (this.selectedTool === "pencil") {
            this.PencilPoints = [{ x, y }];
        }
    }
    mouseUpHandler = (e: MouseEvent) => {
        if (e.button !== 0) return;

        this.clicked = false
        const { x, y } = this.Viewport.getMouse(e);
        const width = x - this.startX;
        const height = y - this.startY;

        const selectedTool = this.selectedTool;
        let shape: Shape | null = null;
        const shapeId = uuidv4();
        if (selectedTool === "rect") {

            shape = {
                id: shapeId,
                type: "rect",
                x: this.startX,
                y: this.startY,
                height,
                width
            }
        } else if (selectedTool === "circle") {
            const radius = Math.max(width, height) / 2;
            shape = {
                id: shapeId,
                type: "circle",
                radius: radius,
                centerX: this.startX + radius,
                centerY: this.startY + radius,
            }
        } else if (selectedTool === "pencil") {
            shape = {
                id: shapeId,
                type: "pencil",
                points: this.PencilPoints
            }
        }
        if (!shape) {
            return;
        }

        this.existingShapes.push(shape);
        this.clearCanvas();

        this.socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({
                shape
            }),
            roomId: this.roomId
        }))
    }
    mouseMoveHandler = (e: MouseEvent) => {
        if (this.clicked) {
            const { x, y } = this.Viewport.getMouse(e);
            const width = x - this.startX;
            const height = y - this.startY;

            this.clearCanvas();
            this.ctx.save();

            this.ctx.strokeStyle = "rgba(255, 255, 255)";
            const selectedTool = this.selectedTool;
            console.log(selectedTool)
            if (selectedTool === "rect") {
                this.ctx.strokeRect(this.startX, this.startY, width, height); 

            } else if (selectedTool === "circle") {
                const radius = Math.max(width, height) / 2;
                const centerX = this.startX + radius;
                const centerY = this.startY + radius;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();         

            } else if (selectedTool === "pencil") {
                this.PencilPoints.push({ x, y });
                if (!this.PencilPoints.length) {
                    return;
                }

                this.ctx.beginPath();
                this.ctx.moveTo(this.PencilPoints[0]!.x, this.PencilPoints[0]!.y);
                for (let i=1; i<this.PencilPoints.length; i++) {
                    this.ctx.lineTo(this.PencilPoints[i]!.x, this.PencilPoints[i]!.y);
                }
                this.ctx.stroke();
            }
            this.ctx.restore();
        }
    }

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler)

        this.canvas.addEventListener("mouseup", this.mouseUpHandler)

        this.canvas.addEventListener("mousemove", this.mouseMoveHandler)    

    }
}