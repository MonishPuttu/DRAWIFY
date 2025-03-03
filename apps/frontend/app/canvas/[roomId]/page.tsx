import { RoomCanvas } from "@/components/RoomCanvas";


export default async function CanvasPage({ params }: {
    params: {
        roomId: string
    }
}) {
    const { roomId } = params;

    return <RoomCanvas roomId={roomId} />
}