"use client";

import EventSocket from "@/components/custom/eventSocket";

export default function Notifications() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex flex-1 flex-col">
        <h1 className="text-3xl italic mb-5">Magic Room!</h1>
        <EventSocket />
      </div>
    </div>
  );
}
