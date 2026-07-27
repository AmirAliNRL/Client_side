import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({
  image,
  title,
  priceAfterDiscount,
  price,
  discountPercent,
  id, // This is likely the variant ID
}) {
  const navigate = useNavigate();

  // Construct the product detail URL. Adjust based on your actual routing structure.
  // Assuming a route like /product-details/:productId/:variantId/:productTitleSlug
  const handleNavigate = () => {
    // Basic slugification for title (replace spaces with hyphens)
    const slugTitle = title ? title.toLowerCase().replace(/\s+/g, '-') : 'product';
    navigate(`/product-details/${id}/${slugTitle}`);
  };

  // Format prices for better readability (e.g., add commas)
  const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price || 0);
  const formattedPriceAfterDiscount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(priceAfterDiscount || 0);

  return (
    <div
      onClick={handleNavigate}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out p-4 flex flex-col h-full cursor-pointer group"
    >
      {/* Product Image */}
      <div className="relative aspect-square mb-4">
        {image ? (
          <img
            src={import.meta.env.VITE_BASE_FILE + image}
            alt={title || "Product Image"}
            className="w-full h-full object-cover rounded-lg"
            loading="lazy" // Improve performance
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
            %{discountPercent} OFF
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-grow justify-between">
        <div>
          {/* Title */}
          <h3 className="text-gray-800 font-semibold text-lg mb-1 truncate">
            {title || "Untitled Product"}
          </h3>

          {/* Prices */}
          <div className="flex items-baseline space-x-2 mb-2">
            <span className="text-red-600 font-bold text-xl">
              {formattedPriceAfterDiscount}
            </span>
            {discountPercent > 0 && (
              <del className="text-gray-500 text-sm">
                {formattedPrice}
              </del>
            )}
          </div>
        </div>

        {/* Footer Actions / Info (Optional) */}
        {/* Example: Add a small "View Details" button or keep it clean */}
        <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
             <span className="text-sm text-gray-500">More Info</span>
             <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"></path></svg>
        </div>
      </div>
    </div>
  );
}
