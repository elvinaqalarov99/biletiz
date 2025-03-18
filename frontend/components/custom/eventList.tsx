import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Event } from "@/interfaces/event";
import { humanReadableDate } from "@/utils/helper";

interface CategoryListProps {
  events: Event[] | null | undefined;
}

// Utility function to generate a random hue (0 to 360)
// const getRandomHue = () => Math.floor(Math.random() * 360);

// Elegant and soft pastel background colors
// const pastelColors = [
//   "hsl(210, 40%, 90%)", // Light Blue
//   "hsl(150, 50%, 85%)", // Soft Green
//   "hsl(35, 80%, 85%)", // Warm Yellow
//   "hsl(320, 50%, 85%)", // Light Purple
//   "hsl(50, 80%, 85%)", // Peachy Orange
// ];

const EventList = ({ events }: CategoryListProps) => {
  // const [randomBackgroundColor, setRandomBackgroundColor] = useState("");
  const [textStyle, setTextStyle] = useState("");

  useEffect(() => {
    // setRandomBackgroundColor(
    //   pastelColors[Math.floor(Math.random() * pastelColors.length)],
    // );
    setTextStyle("text-white italic font-bold");
  }, []);

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {events?.length ? (
        events?.map((event) => (
          <Link
            key={event.id}
            href={`/dashboard/events/${event.id}`}
            className="w-full"
          >
            <Card
              className={cn(
                "background-img shadow-lg rounded-lg transform transition-all duration-300 hover:scale-105 relative h-[350px] flex flex-col",
                textStyle,
              )}
              style={{ backgroundImage: `url(${event.posterBgUrl})` }}
            >
              <div className="-z-10 absolute inset-0 bg-black opacity-50 rounded-lg"></div>

              <CardHeader>
                <CardTitle className="font-bold text-2xl">
                  {event.name}
                </CardTitle>
              </CardHeader>
              <CardFooter className="mt-auto">
                <span className="text-2xl">
                  {humanReadableDate(event.eventStartsAt)}
                </span>
              </CardFooter>
            </Card>
          </Link>
        ))
      ) : (
        <h1>NO EVENTS RIGHT NOW, PLEASE CHECK LATER...</h1>
      )}
    </div>
  );
};

export default EventList;
