"use client";

import CategoryList from "@/components/custom/categoryList";
import { apiService } from "@/utils/apiService";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.getAxiosInstance().get("/categories");
        console.log(response.data);
        setCategories(response.data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchCategories().then();
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex flex-1 flex-col">
        <CategoryList categories={categories} />
      </div>
    </div>
  );
}
