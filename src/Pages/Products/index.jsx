import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FetchData from "../../Utils/FetchData";
import ProductCard from "./ProductsCard";
import Loading from "../../Components/Loading";

export default function Products() {
  const [products, setProducts] = useState([]); // Initialize with empty array
  const [sort, setSort] = useState("-createdAt");
  const [page, setPage] = useState(1);
  const [price, setPrice] = useState([0, 10000]);
  const [productCount, setProductCount] = useState(0); // Initialize with 0
  const { categoryId } = useParams();
  const itemsPerPage = 10; // Number of products per page

  useEffect(() => {
    (async () => {
      const result = await FetchData(
        `products?${categoryId !== "all" ? `categoryId=${categoryId}&` : ""}sort=${sort}&minPrice[$gte]=${price[0]}&maxPrice[$lte]=${price[1]}&page=${page}&limit=${itemsPerPage}&populate=defaultProductVariantId,variantIds`,
      );

      setProducts(result.data);
      setProductCount(result.count);
    })();
  }, [sort, price, page, categoryId]);
  const items = products?.map((pr) => (
    <ProductCard
      avgRating={pr.avgRating}
      variantIds={pr.variantIds}
      image={pr.images[0]}
      discountPercent={pr?.defaultProductVariantId?.discountPercent}
      title={pr.title}
      id={pr._id}
      price={pr?.defaultProductVariantId?.price}
      priceAfterDiscount={pr?.defaultProductVariantId?.priceAfterDiscount}
      key={pr._id}
    />
  ));

  const handlePriceChange = (e, index) => {
    const newPrice = [...price];
    newPrice[index] = e.target.value;
    setPrice(newPrice);
  };

  const totalPages = Math.ceil(productCount / itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-gray-100 p-4 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row gap-4 mb-4 md:mb-0 w-full md:w-auto">
          <select
            name="sort"
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }} // Reset page on sort change
            value={sort}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="-createdAt">Date</option>
            <option value="title">A-Z</option>
            <option value="-title">Z-A</option>
            <option value="-avgRating">Rate</option>
          </select>

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min Price"
              value={price[0]}
              onChange={(e) => handlePriceChange(e, 0)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-24"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={price[1]}
              onChange={(e) => handlePriceChange(e, 1)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-24"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.length > 0 ? (
          items
        ) : (
          <div className="col-span-full text-center text-gray-600 py-10">
            No products found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {productCount > itemsPerPage && (
        <div className="flex justify-center items-center mt-8 space-x-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg ${page === 1 ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
          >
            Previous
          </button>
          <span className="text-gray-700 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-lg ${page === totalPages ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
