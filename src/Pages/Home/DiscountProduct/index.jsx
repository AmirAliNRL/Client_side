import React, { useEffect, useState } from "react";
import { SwiperSlide,Swiper } from "swiper/react"; // Import SwiperSlide
import FetchData from "../../../Utils/FetchData";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination"; // Added pagination styles for potential future use or if you decide to add dots

// Import Swiper modules
import { Navigation } from "swiper/modules";
import ProductCard from "./ProductCard"; // Assuming ProductCard is in the same directory or correctly aliased

export default function DiscountProduct() {
  const [products, setProducts] = useState([]); // Initialize with empty array for safety

  useEffect(() => {
    (async () => {
      const result = await FetchData(
        "product-variants?sort=-discountPercent&limit=10&page=1&populate=productId,variantId",
      );
      setProducts(result.data || []);
    })();
  }, []);

  const items =
    products?.map((sl) => (
      <SwiperSlide
        key={sl._id}
        className="!flex !justify-center !items-center" // Ensure slides are centered if content is smaller
      >
        {/* Pass necessary props to ProductCard */}
        <ProductCard
          image={sl.productId?.images?.[0]} // Safely access image
          title={sl.productId?.title}
          priceAfterDiscount={sl.priceAfterDiscount}
          price={sl.price}
          discountPercent={sl.discountPercent}
          id={sl._id} // Assuming this is the variant ID you want for details
        />
      </SwiperSlide>
    )) || [];

  return (
    <div className="w-full relative max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl my-10">
      <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
        🔥 Special Discount Products 🔥
      </h2>
      <Swiper
        modules={[Navigation]}
        spaceBetween={20} // Increased space between cards slightly
        slidesPerView={1} // Default to 1 slide on small screens
        loop={true}
        navigation={{
          nextEl: ".swiper-button-next-discount", // Custom class for next button
          prevEl: ".swiper-button-prev-discount", // Custom class for prev button
        }}
        // Responsive breakpoints
        breakpoints={{
          640: {
            // sm
            slidesPerView: 1.5, // Show 1.5 cards on small screens
            spaceBetween: 25,
          },
          768: {
            // md
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1024: {
            // lg
            slidesPerView: 2.5, // Show 2.5 cards on large screens
            spaceBetween: 35,
          },
          1280: {
            // xl
            slidesPerView: 3, // Show 3 cards on extra-large screens
            spaceBetween: 40,
          },
        }}
        className="w-full h-auto" // Removed fixed height, let content define it
      >
        {items}
      </Swiper>

      {/* Custom Navigation Arrows */}
      <div className="swiper-button-prev-discount absolute top-1/2 z-40 left-[5%]  cursor-pointer bg-gray-400 backdrop-blur-3xl rounded-full  text-white  transition-colors duration-300  w-[50px] h-[50px] flex items-center justify-center">prev</div>
      <div className="swiper-button-next-discount absolute top-1/2 z-40 right-[5%] cursor-pointer bg-gray-400 backdrop-blur-3xl rounded-full  text-white   transition-colors duration-300 w-[50px] h-[50px] flex items-center justify-center">next</div>
    </div>
  );
}
