export default async function Page({ params }: { params: Promise<{ roomId: string }> }) {
    const resolvedParams = await params; 
    const { roomId } = resolvedParams;
    return <div>Room ID: {roomId}</div>;
}
  