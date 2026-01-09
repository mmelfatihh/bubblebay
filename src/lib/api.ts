export const getToken = async (roomName: string, participantName: string) => {
  // NOTE: We removed "http://localhost:3000". 
  // The browser now automatically asks the same domain it is currently on.
  const response = await fetch("/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
        roomName: roomName,           
        participantName: participantName 
    }),
  });

  if (!response.ok) {
    const errorText = await response.text(); 
    console.error("❌ SERVER ERROR:", errorText);
    throw new Error(`Server error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.token;
};