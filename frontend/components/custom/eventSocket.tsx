import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useUserStore } from "@/store/userStore";
import { Event } from "@/interfaces/event";
import EventList from "./eventList";

interface Message {
  id: string;
  message: string;
}

const EventSocket = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const { user } = useUserStore();

  useEffect(() => {
    const socketIo = io("ws://localhost:5001");

    socketIo.on("connect", () => {
      console.log("connected to WebSocket server");
      socketIo.emit("setName", user?.email);
    });

    socketIo.on("nameSet", (message: Message) => {
      console.log(message);
    });

    socketIo.on("newRelatedEvents", (events: Event[]) => {
      setEvents(events);
    });

    return () => {
      socketIo.disconnect();
    };
  }, [user, events]);

  return (
    <div className="flex flex-col float-start">
      <EventList events={events} />
    </div>
  );
};

export default EventSocket;
