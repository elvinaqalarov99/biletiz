import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Category } from "@/interfaces/category";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CategoryListProps {
  categories: Category[];
}

// Utility function to generate a random hue (0 to 360)
// const getRandomHue = () => Math.floor(Math.random() * 360);

// Elegant and soft pastel background colors
const pastelColors = [
  "hsl(210, 40%, 90%)", // Light Blue
  "hsl(150, 50%, 85%)", // Soft Green
  "hsl(35, 80%, 85%)", // Warm Yellow
  "hsl(320, 50%, 85%)", // Light Purple
  "hsl(50, 80%, 85%)", // Peachy Orange
];

const CategoryList = ({ categories }: CategoryListProps) => {
  const [randomBackgroundColor, setRandomBackgroundColor] = useState("");
  const [textStyle, setTextStyle] = useState("");

  useEffect(() => {
    setRandomBackgroundColor(
      pastelColors[Math.floor(Math.random() * pastelColors.length)],
    );
    setTextStyle("text-gray-900 italic");
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Card
          key={category.id}
          className={cn(
            "max-w-sm shadow-lg rounded-lg transform transition-all duration-300 hover:scale-105 text-",
            textStyle,
          )}
          style={{ backgroundColor: randomBackgroundColor }}
        >
          <CardHeader>
            <CardTitle className="font-bold text-2xl">
              {category.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              <Link href={category.externalUrl || ""} passHref target="_blank">
                {category.externalUrl}
              </Link>
            </CardDescription>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default CategoryList;
