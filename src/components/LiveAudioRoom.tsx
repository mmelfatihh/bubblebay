import { 
    LiveKitRoom, 
    useParticipants, 
    useLocalParticipant, 
    useConnectionState,
    useRoomContext
} from "@livekit/components-react";
import { useEffect, useState } from "react";
import { Room } from "./Room";
import "@livekit/components-styles";

interface LiveAudioRoomProps {
  token: string;
  serverUrl: string;
  onHangUp: () => void;
}

export const LiveAudioRoom = ({ token, serverUrl, onHangUp }: LiveAudioRoomProps) => {
  return (
    <LiveKitRoom
      video={false}
      audio={true}
      token={token}
      serverUrl={serverUrl}
      onDisconnected={onHangUp}
      connect={true}
      data-lk-theme="default"
      // FIX: Set background to transparent so App's background shows through
      style={{ 
        height: "100%", 
        width: "100%", 
        position: "absolute", 
        inset: 0, 
        backgroundColor: "transparent" 
      }}
    >
      <RoomController onHangUp={onHangUp} />
    </LiveKitRoom>
  );
};

const RoomController = ({ onHangUp }: { onHangUp: () => void }) => {
  const connectionState = useConnectionState();
  const remoteParticipants = useParticipants();
  const { localParticipant } = useLocalParticipant();
  const room = useRoomContext();
  
  const [users, setUsers] = useState<any[]>([]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
        if (room.state !== 'disconnected') {
            room.disconnect();
        }
    };
  }, [room]);

  // Data Mapping
  useEffect(() => {
     const myself = localParticipant || room.localParticipant;

     const mappedLocal = myself ? [{
        id: myself.identity,
        label: "ME",
        isMe: true,
        isMuted: !myself.isMicrophoneEnabled,
        participant: myself
     }] : [];

     const mappedRemote = remoteParticipants
        .filter(p => p.identity !== myself?.identity)
        .map(p => ({
            id: p.identity,
            label: p.identity.substring(0, 2).toUpperCase(),
            isMe: false,
            isMuted: !p.isMicrophoneEnabled,
            participant: p
        }));

     setUsers([...mappedLocal, ...mappedRemote]);
  }, [remoteParticipants, localParticipant, connectionState, room]);

  return <Room users={users} onHangUp={onHangUp} />;
};