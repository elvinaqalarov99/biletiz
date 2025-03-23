"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Category } from "@/interfaces/category";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { Heart } from "lucide-react";
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
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/dashboard/categories/${category.id}`}
          className="w-full"
        >
          <Card
            className={cn(
              "relative max-w-lg w-full backdrop-blur-md transition-all rounded-xl",
              textStyle,
            )}
            style={{ backgroundColor: randomBackgroundColor }}
          >
            <CardContent className="p-8 flex flex-col">
              <h3 className="text-2xl font-semibold text-gray-900 italic">
                {category.name}
              </h3>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(category.id);
                }}
                className="absolute top-4 right-4"
              >
                {categoryPreferencesIds?.includes(category.id) ? (
                  <Heart className="text-red-500 fill-red-500" />
                ) : (
                  <Heart className="text-gray-400 hover:text-red-500" />
                )}
              </button>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
