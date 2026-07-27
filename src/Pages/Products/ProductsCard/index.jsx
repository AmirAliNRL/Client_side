import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({
  variantIds,
  image,
  title,
  id,
  avgRating,
  price,
  priceAfterDiscount,
  discountPercent,
}) {
  const navigate = useNavigate();

  // Determine variant type and display accordingly
  const renderVariants = () => {
    if (!variantIds || variantIds.length === 0) return null;
    console.log(variantIds)
    const render = variantIds.map((vr, index) => {
      if (vr.type == "color") {
        return <div
          key={index}
          className={`w-3 h-3 rounded-full border border-gray-300 cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-blue-500 transition-all`}
          style={{backgroundColor:`${vr.value}`}}
          title={vr.value} // Tooltip for color name/code
        ></div>;
      } else {
        return <span
          key={index}
          className="text-xs text-gray-600 px-1.5 py-0.5 border border-gray-300 rounded-sm cursor-pointer hover:bg-gray-200 transition-all"
          title={vr.value}
        >
          {vr.value}
        </span>;
      }
    });
    return render
  };

  const slugTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return (
    <div
      onClick={() => navigate(`/product-details/${id}/${slugTitle}`)}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out p-4 flex flex-col h-full cursor-pointer group border border-transparent hover:border-blue-500"
    >
      <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
        <img
          src={import.meta.env.VITE_BASE_FILE + image}
          alt={title}
          className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/placeholder-image.png";
          }} // Basic error handling for image load
        />
        {discountPercent > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow z-10">
            -{discountPercent}%
          </span>
        )}
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1.5">
          {renderVariants()}
        </div>
      </div>

      <div className="flex flex-col flex-grow justify-between">
        <div>
          <h2 className="text-gray-800 font-semibold text-lg mb-1 line-clamp-2">
            {title}
          </h2>
          {avgRating && (
            <div className="flex items-center mb-2">
              <span className="text-gray-500 text-sm ml-1">
                ({avgRating.toFixed(1)})
              </span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span
              className={`text-red-600 font-bold text-xl ${discountPercent > 0 ? "" : "text-gray-800"}`}
            >
              {priceAfterDiscount !== undefined
                ? new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(priceAfterDiscount)
                : "N/A"}
            </span>
            {discountPercent > 0 && (
              <del className="text-gray-500 text-sm">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(price)}
              </del>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
