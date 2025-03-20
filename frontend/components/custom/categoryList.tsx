"use client";

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
import { useUserStore } from "@/store/userStore";
import { Heart, HeartOff } from "lucide-react"; // Importing lucide-react icons
import { apiService } from "@/utils/apiService";

interface CategoryListProps {
  categories: Category[];
}

// Elegant and soft pastel background colors
const pastelColors = [
  "hsl(210, 40%, 90%)", // Light Blue
];

const CategoryList = ({ categories }: CategoryListProps) => {
  const [randomBackgroundColor, setRandomBackgroundColor] = useState("");
  const [textStyle, setTextStyle] = useState("");
  const { user, setUser } = useUserStore();
  const categoryPreferencesIds = user?.categoryPreferences.map(
    (category) => category.id,
  );

  // Toggle function for heart icon
  const toggleFavorite = async (categoryId: number) => {
    try {
      const res = await apiService
        .getAxiosInstance()
        .post(`users/category-preference/${categoryId}`);

      if (res.status === 200) {
        setUser(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setRandomBackgroundColor(
      pastelColors[Math.floor(Math.random() * pastelColors.length)],
    );
    setTextStyle("text-gray-900 italic");
  }, [user]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Card
          key={category.id}
          className={cn(
            "relative max-w-sm shadow-lg rounded-lg transform transition-all duration-300 hover:scale-105 text-",
            textStyle,
          )}
          style={{ backgroundColor: randomBackgroundColor }}
        >
          {/* Favorite icon */}
          <span
            className="absolute top-2 right-2 text-xl cursor-pointer text-red-500"
            onClick={() => toggleFavorite(category.id)}
          >
            {categoryPreferencesIds?.includes(category.id) ? (
              <Heart className="text-red-500" /> // Red heart when filled
            ) : (
              <HeartOff className="text-gray-500" /> // Gray heart when empty
            )}
          </span>

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
            <Link
              href={`/dashboard/categories/${category.id}`}
              className="w-full"
            >
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default CategoryList;
