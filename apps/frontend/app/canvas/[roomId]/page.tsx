"use client"
import { use } from "react";
import { RoomCanvas } from "@/components/RoomCanvas";

export default function Page({ params }: { params: Promise<{ roomId: string }> }) {
    const { roomId } = use(params);
    return <RoomCanvas roomId={roomId} />;
}