import React, { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { Card } from "../ui/card";
import { useUserStore } from "@/store/userStore";

interface Message {
  id: string;
  message: string;
}

const Home = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useUserStore();

  useEffect(() => {
    const socketIo = io("ws://localhost:5001");
    setSocket(socketIo);

    socketIo.on("connect", () => {
      console.log("connected to WebSocket server");
      socketIo.emit("setName", user?.email);
    });

    socketIo.on("pong", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socketIo.on("nameSet", (message: Message) => {
      console.log(message);
    });

    return () => {
      socketIo.disconnect();
    };
  }, [user]);

  // Send message to the server
  const handleSendMessage = () => {
    if (socket && message) {
      socket.emit("ping", message);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col float-start">
      <div className="flex flex-col max-w-screen-sm">
        <input
          className="w-full p-2 border border-gray-300 rounded-md mb-2"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button
          className="w-full p-2 bg-blue-500 text-white rounded-md"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
      <div className="flex flex-col mt-4">
        <h2 className="text-xl font-bold">Messages:</h2>
        <ul className="list-disc">
          {messages.map((msg: Message, index) => (
            <Card
              key={index}
              className={`w-full p-4 my-2 rounded-lg shadow-md ${
                msg.id === socket?.id
                  ? "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white"
                  : "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 text-black"
              }`}
            >
              {msg?.message}
            </Card>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
