export class Viewport {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    public zoom: number;
    private offset: Point;
    private drag: Drag;
    public center: Point;
    public onZoomChange: () => void = () => {};

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;

        this.zoom = 1;
        this.center = new Point(canvas.width / 2, canvas.height / 2);
        this.offset = new Point(0, 0);

        this.drag= {
            start: new Point(0, 0),
            end: new Point(0, 0),
            offset: new Point(0, 0),
            active: false
        }

        this.addEventListeners();
    }

    getMouse(event: MouseEvent) {
        const pan = this.getOffset(); // effective panning offset
        return {
          x: this.zoom * (event.offsetX - (this.center.x + pan.x)),
          y: this.zoom * (event.offsetY - (this.center.y + pan.y))
        };
    }

    getOffset() {
        return add(this.offset, this.drag.offset);
    }

    addEventListeners() {
        this.canvas.addEventListener("wheel", this.handleMouseWheel.bind(this));
        this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
        this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
        this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
    }

    handleMouseWheel(event: { deltaY: number; }) {
        const dir = Math.sign(event.deltaY);
        const step = 0.1;
        
        this.zoom += dir * step;
        this.zoom = Math.max(1, Math.min(5, this.zoom));

            this.onZoomChange();
    }

    handleMouseDown(event: MouseEvent) {
        if (event.button === 1) {
            this.drag.start = new Point(event.offsetX, event.offsetY);
            this.drag.active = true;
        }
    }

    handleMouseMove(event: MouseEvent) {
        if (this.drag.active) {
            const current = new Point(event.offsetX, event.offsetY);
            this.drag.offset = subtract(current, this.drag.start);

            this.onZoomChange();
        }
    }

    handleMouseUp(event: MouseEvent) {
        if (this.drag.active) {
            this.offset = add(this.offset, this.drag.offset);
            this.drag = {
                start: new Point(0, 0),
                end: new Point(0, 0),
                offset: new Point(0, 0),
                active: false
            }
        }
        this.onZoomChange();
    }
}

class Point {
    x: number;
    y:number;
    constructor(x: number, y:number) {
        this.x = x;
        this.y = y;
    }
}

interface Drag {
    start: Point;
    end: Point;
    offset: Point;
    active: boolean;
}

function subtract(p1: Point, p2: Point) {
    return new Point(p1.x - p2.x, p1.y - p2.y)
}
function add(p1: Point, p2: Point) {
    return new Point(p1.x + p2.x, p1.y + p2.y)
}

function scale(p: Point, scaler:number) {
    return new Point(p.x * scaler, p.y * scaler);
}

