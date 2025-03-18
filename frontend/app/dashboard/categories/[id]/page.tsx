"use client";

import EventList from "@/components/custom/eventList";
import { Category } from "@/interfaces/category";
import { apiService } from "@/utils/apiService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CategoryItem() {
  const { id } = useParams(); // Retrieve the id from the URL parameters

  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await apiService
          .getAxiosInstance()
          .get(`/categories/${id}`);
        setCategory(response.data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchCategory().then();
  }, [id]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <h1 className="text-3xl">{category?.name}</h1>
      <EventList events={category?.events} />
    </div>
  );
}
