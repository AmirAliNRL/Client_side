import React, { useEffect, useState } from "react";
import FetchData from "../../../Utils/FetchData";
import Loading from "../../../Components/Loading";
import CategoryCard from "./CategoryCard";

export default function CategorySection() {
  const [categories, setCategories] = useState();

  useEffect(() => {
    (async () => {
      const result = await FetchData("categories?limit=10&page=1");
      setCategories(result.data);
    })();
  }, []);

  if (!categories) return <Loading />;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {categories.map((ct) => (
        <CategoryCard
          key={ct._id}
          id={ct._id}
          title={ct.title}
          image={ct.image}
        />
      ))}
    </div>
  );
}
