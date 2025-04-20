import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon, Moon, Sun, Eraser, Share2 } from "lucide-react";
import { Game } from "@/draw/Game";
import { Viewport } from "@/draw/ViewPort";
import { ShareDialog } from "./ShareDialog";

export type Tool = "circle" | "rect" | "pencil" | "eraser";

export function Canvas({
    roomId,
    socket,
}: {
    socket: WebSocket;
    roomId: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("circle");
    const [isDark, setIsDark] = useState(() => {
        // Check localStorage first
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        // Then check system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    const [showShareDialog, setShowShareDialog] = useState(false);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
        // Redraw canvas when theme changes
        game?.clearCanvas();
    }, [isDark, game]);

    useEffect(() => {
        if (game) {
            game.setTool(selectedTool as "circle" | "rect" | "pencil");
        }
    }, [selectedTool, game]);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        } 
        const viewport = new Viewport(canvasRef.current);
        const g = new Game(canvasRef.current, roomId, socket, viewport);
        setGame(g);

        return () => {
            g.destroy();
        }
    }, [roomId, socket]);

    return (
        <div style={{
            height: "100vh",
            overflow: "hidden"
        }}>
            <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
            <Topbar 
                setSelectedTool={setSelectedTool} 
                selectedTool={selectedTool} 
                isDark={isDark}
                setIsDark={setIsDark}
                onShareClick={() => setShowShareDialog(true)}
            />
            <ShareDialog 
                isOpen={showShareDialog}
                onClose={() => setShowShareDialog(false)}
                roomId={roomId}
            />
        </div>
    );
}

function Topbar({
    selectedTool, 
    setSelectedTool,
    isDark,
    setIsDark,
    onShareClick
}: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void,
    isDark: boolean,
    setIsDark: (dark: boolean) => void,
    onShareClick: () => void
}) {
    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-2 bg-white/10 dark:bg-gray-900/50 backdrop-blur-md p-2 rounded-xl border border-white/20 dark:border-gray-700 shadow-lg">
                <IconButton 
                    onClick={() => setSelectedTool("pencil")}
                    activated={selectedTool === "pencil"}
                    icon={<Pencil className="w-5 h-5" />}
                />
                <IconButton 
                    onClick={() => setSelectedTool("rect")}
                    activated={selectedTool === "rect"}
                    icon={<RectangleHorizontalIcon className="w-5 h-5" />}
                />
                <IconButton 
                    onClick={() => setSelectedTool("circle")}
                    activated={selectedTool === "circle"}
                    icon={<Circle className="w-5 h-5" />}
                />
                <IconButton 
                    onClick={() => setSelectedTool("eraser")}
                    activated={selectedTool === "eraser"}
                    icon={<Eraser className="w-5 h-5" />}
                />
                <div className="h-6 w-px bg-gray-400 dark:bg-gray-700 mx-1" />
                <IconButton 
                    onClick={() => setIsDark(!isDark)}
                    activated={false}
                    icon={
                        isDark ? (
                            <Sun className="w-5 h-5 text-yellow-400" />
                        ) : (
                            <Moon className="w-5 h-5 text-purple-400" />
                        )
                    }
                />
                <IconButton 
                    onClick={onShareClick}
                    activated={false}
                    icon={<Share2 className="w-5 h-5" />}
                />
            </div>
        </div>
    );
}