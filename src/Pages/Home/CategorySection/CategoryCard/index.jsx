import React from "react";
import { useNavigate } from "react-router-dom";

export default function CategoryCard({ id, title, image }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate(`/products/${id}/${title.replaceAll(" ", "-")}`)
      }
      className="cursor-pointer group bg-white shadow-sm rounded-xl p-4 flex flex-col items-center 
                 border border-gray-200 hover:border-indigo-500 transition duration-300"
    >
      {image ? (
        <img
          src={import.meta.env.VITE_BASE_FILE + image}
          alt={title}
          className="w-24 h-24 object-cover rounded-full mb-3 group-hover:scale-105 transition duration-300"
        />
      ) : (
        <span className="text-gray-500 text-sm mb-3">No Picture</span>
      )}

      <h2 className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition">
        {title}
      </h2>
    </div>
  );
}
