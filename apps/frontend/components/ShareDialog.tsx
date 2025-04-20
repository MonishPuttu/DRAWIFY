import { Copy, X } from "lucide-react";
import { useState } from "react";

interface ShareDialogProps {
    isOpen: boolean;
    onClose: () => void;
    roomId: string;
}

export function ShareDialog({ isOpen, onClose, roomId }: ShareDialogProps) {
    const [copied, setCopied] = useState(false);
    const url = `${window.location.origin}/canvas/${roomId}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl max-w-md w-full relative border-2 border-purple-200 dark:border-gray-700">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-200"
                >
                    <X className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold mb-4 dark:text-white">Share Drawing</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Share this link with others to collaborate in real-time:
                </p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={url}
                        readOnly
                        className="flex-1 px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                        onClick={handleCopy}
                        className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                    >
                        {copied ? (
                            <>
                                <Copy className="w-4 h-4" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                Copy
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
} 