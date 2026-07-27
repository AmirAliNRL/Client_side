import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FetchData from "../../Utils/FetchData";
import Loading from "../../Components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../Store/CartSlice";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState();
  const [productVariant, setProductVariant] = useState();
  const [imgCurrentIndex, setImageCurrentIndex] = useState(0);
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  useEffect(() => {
    (async () => {
      const res = await FetchData(`products/${id}`);
      const p = res.data[0];
      setProduct(p);

      p.productVariantIds?.forEach((item) => {
        if (item._id.toString() === id.toString()) {
          setProductVariant(item);
        }
      });

      // fallback: select first variant if none matched id
      if (!productVariant && p.productVariantIds?.length) {
        setProductVariant(p.productVariantIds[0]);
      }
    })();
  }, [id]);

  if (!product) return <Loading />;

  const imgItems = product.images?.map((image, index) => (
    <button
      key={index}
      onClick={() => setImageCurrentIndex(index)}
      className={`w-20 h-20 rounded-xl overflow-hidden border transition transform flex-shrink-0
        ${
          imgCurrentIndex === index
            ? "border-indigo-500 ring-2 ring-indigo-300 scale-105"
            : "border-gray-200 hover:border-indigo-400 hover:scale-105"
        }`}
    >
      <img
        src={import.meta.env.VITE_BASE_FILE + image}
        alt={product.title}
        className="w-full h-full object-cover"
      />
    </button>
  ));

  const productVariantItems = product.productVariantIds?.map((prv) => (
    <button
      key={prv._id}
      onClick={() => setProductVariant(prv)}
      className={`px-3 py-1 rounded-full text-xs sm:text-sm border transition
        ${
          productVariant?._id === prv._id
            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
            : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:text-indigo-600"
        }`}
    >
      {prv.variantId.value}
    </button>
  ));

  const productVariants = product.productVariantIds?.map((e) => {
    const cartQuantity =
      items?.find((item) => item._id == e._id)?.cartQuantity || 0;
    return (
      <div
        key={e._id}
        className={`grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs sm:text-sm px-3 py-2 rounded-xl border
        ${
          productVariant?._id === e._id
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-200 bg-gray-50"
        }`}
      >
        <p className="text-gray-700">
          Qty: <span className="font-medium">{e.quantity}</span>
        </p>
        <p className="text-gray-700">
          Price: <span className="font-medium">{e.price}</span>
        </p>
        <p className="text-gray-700">
          Off: <span className="font-medium">{e.discountPercent}%</span>
        </p>
        <p className="text-emerald-600 font-semibold">
          Final: {e.priceAfterDiscount}
        </p>
        <p className="text-gray-500">Sold: {e.boughtCount}</p>
        {cartQuantity == 0 ? (
          <button
            disabled={cartQuantity == e.quantity}
            className="bg-blue-400 disabled:opacity-20 text-white rounded-lg px-3 py-2"
            onClick={() => dispatch(addToCart({ ...e, productId: product }))}
          >
            Add
          </button>
        ) : (
          <div className="flex items-center gap-3 ">
            <button
              className="bg-red-400 text-white rounded-lg px-3 py-2"
              onClick={() => dispatch(removeFromCart(e._id))}
            >
              -
            </button>
            <span>{cartQuantity}</span>
            <button
              disabled={cartQuantity == e.quantity}
              className="bg-green-400 disabled:opacity-20 text-white rounded-lg px-3 py-2"
              onClick={() => dispatch(addToCart({ ...e, productId: product }))}
            >
              +
            </button>
          </div>
        )}
      </div>
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Outer card */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-10">
          {/* Left - Gallery */}
          <div className="flex flex-col gap-4">
            <div className="w-full border border-gray-200 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center">
              <img
                src={
                  import.meta.env.VITE_BASE_FILE +
                  product.images[imgCurrentIndex]
                }
                alt={product.title}
                className="w-full h-[320px] sm:h-[400px] lg:h-[450px] object-contain bg-white"
              />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">{imgItems}</div>
          </div>

          {/* Right - Details */}
          <div className="flex flex-col gap-5">
            {/* Title & basic info */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-600">
                <span className="px-2 py-1 rounded-full bg-gray-100">
                  Category:{" "}
                  <span className="font-semibold">
                    {product.categoryId.title}
                  </span>
                </span>
                <span className="px-2 py-1 rounded-full bg-gray-100">
                  Brand:{" "}
                  <span className="font-semibold">{product.brandId.title}</span>
                </span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700">
                <span className="font-semibold">{product.avgRating}</span>
                <span>⭐</span>
              </span>
              <span className="text-gray-500">
                {product.ratingCount} ratings
              </span>
            </div>

            {/* Variant selector */}
            {product.productVariantIds?.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-800">
                  Choose Variant
                </h3>
                <div className="flex flex-wrap gap-2">
                  {productVariantItems}
                </div>
              </div>
            )}

            {/* Selected variant info */}
            {productVariant && (
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold">Variant:</span>{" "}
                    {productVariant.variantId.value}
                  </p>
                  <p className="text-xs text-gray-500">
                    Sold: {productVariant.boughtCount}
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="text-gray-700">
                    <span className="font-medium">Qty:</span>{" "}
                    {productVariant.quantity}
                  </span>
                  <span className="text-gray-700 line-through">
                    {productVariant.price}
                  </span>
                  <span className="text-rose-600 font-semibold">
                    -{productVariant.discountPercent}%
                  </span>
                  <span className="text-emerald-600 font-bold text-lg">
                    {productVariant.priceAfterDiscount}
                  </span>
                </div>
              </div>
            )}

            {/* All variants table */}
            {product.productVariantIds?.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-800">
                  All Variants
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {productVariants}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">
                Description
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* CTA buttons */}
            <div className="mt-2 flex flex-wrap gap-3">
              <button className="px-6 py-2.5 rounded-full bg-indigo-600 text-white text-sm font-semibold shadow-md hover:bg-indigo-700 active:bg-indigo-800 transition">
                Add to Cart
              </button>
              <button className="px-6 py-2.5 rounded-full border border-gray-300 text-sm font-semibold text-gray-800 hover:border-indigo-500 hover:text-indigo-600 transition">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
