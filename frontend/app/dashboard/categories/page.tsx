"use client";

import CategoryList from "@/components/custom/categoryList";
import { apiService } from "@/utils/apiService";
import React, { useEffect, useState } from "react";

export default function Category() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.getAxiosInstance().get("/categories");
        setCategories(response.data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchCategories().then();
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <CategoryList categories={categories} />
    </div>
  );
}
