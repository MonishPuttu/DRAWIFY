"use client"

import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
const WS_URL = process.env.NEXT_PUBLIC_WS_URL

export function RoomCanvas({ roomId }: {roomId: string}) {
    const [Socket, setSocket] = useState<WebSocket | null>(null);
  
    // use ${WS_URL} in useEffect for local development
    useEffect(() => {
        const ws = new WebSocket(`?token=${localStorage.getItem("token")}`)
        // eslint-disable-next-line react-hooks/exhaustive-deps
        ws.onopen = () => {
            setSocket(ws);
            const data = JSON.stringify({
                type: "join_room",
                roomId
            });
            console.log(data);
            ws.send(data)
        }
    }, [])

    if (!Socket) {
        return <div>
            Connecting to server...
        </div>
    }

    return <div>
        <Canvas roomId={roomId} socket={Socket} />
    </div>
}