import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Event } from "@/interfaces/event";
import { humanReadableDate } from "@/utils/helper";
import { Category } from "@/interfaces/category";
import { Calendar, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface CategoryListProps {
  category: Category | null;
  events: Event[] | null | undefined;
}

const textStyle = "text-white italic font-bold text-lg";

const EventList = ({ category, events }: CategoryListProps) => {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {events?.length ? (
        events?.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <Link
              key={event.id}
              href={`https://iticket.az/events/${category?.slug}/${event.slug}`}
              target="_blank"
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
                  <CardTitle className="font-bold">{event.name}</CardTitle>
                </CardHeader>
                <CardFooter className="flex justify-around mt-auto">
                  <div className="flex items-start flex-col">
                    <div className="flex items-center justify-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      {humanReadableDate(event.eventStartsAt)}
                    </div>
                    <div className="flex items-center justify-center">
                      {event.venues[0]?.name ? (
                        <>
                          <MapPin className="mr-2 h-4 w-4" />
                          {event.venues[0].name}
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div>
                    {event.minPrice === event.maxPrice
                      ? event.minPrice
                      : `${event.minPrice}+`}{" "}
                    ₼
                  </div>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>
        ))
      ) : (
        <h1>NO EVENTS RIGHT NOW, PLEASE CHECK LATER...</h1>
      )}
    </div>
  );
};

export default EventList;
