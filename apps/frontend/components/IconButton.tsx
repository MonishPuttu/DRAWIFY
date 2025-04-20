import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function IconButton({
    icon, onClick, activated
}: {
    icon: ReactNode,
    onClick: () => void,
    activated: boolean
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "p-3 rounded-lg transition-all duration-200",
                "hover:scale-105 active:scale-95",
                activated 
                    ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 shadow-md border-2 border-purple-500" 
                    : "bg-purple-100/80 dark:bg-purple-900/80 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800 hover:text-purple-700 dark:hover:text-purple-300 border-2 border-transparent"
            )}
        >
            {icon}
        </button>
    );
}