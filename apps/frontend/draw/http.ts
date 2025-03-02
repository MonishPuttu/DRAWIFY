const HTTP_BACKEND = process.env.NEXT_PUBLIC_HTTP_BACKEND;
import axios from "axios";

export async function getExistingShapes(roomId: string) {
    const res = await axios.get(`${HTTP_BACKEND}/api/v1/user/chats/${roomId}`);
    const messages = res.data.messages;

    const shapes = messages.map((x: {message: string}) => {
        const messageData = JSON.parse(x.message)
        return messageData.shape;
    })

    return shapes;
}