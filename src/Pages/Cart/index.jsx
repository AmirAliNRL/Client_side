import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, clear, removeFromCart } from "../../Store/CartSlice";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { items, totalPrice, totalPriceAfterDiscount } = useSelector(
    (state) => state.cart,
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (items.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
        <h2 className="text-2xl font-semibold">Your cart is empty</h2>
      </div>
    );

  const tableItems = items.map((item, index) => (
    <tr
      key={item._id}
      className="border-b hover:bg-gray-50 transition text-sm"
    >
      <td className="py-4 px-3">{index + 1}</td>

      <td
        className="py-4 px-3 cursor-pointer text-teal-600 hover:underline"
        onClick={() =>
          navigate(
            `/product-details/${item.productId._id}/${item.productId.title}`
          )
        }
      >
        {item.productId.title}
      </td>

      <td className="py-4 px-3">
        <img
          src={import.meta.env.VITE_BASE_FILE + item.productId.images[0]}
          alt=""
          className="w-14 h-14 object-cover rounded-md"
        />
      </td>

      <td className="py-4 px-3 text-gray-600">${item.price.toFixed(2)}</td>

      <td className="py-4 px-3 text-green-600 font-semibold">
        ${item.priceAfterDiscount.toFixed(2)}
      </td>

      <td className="py-4 px-3">{item.cartQuantity}</td>

      <td className="py-4 px-3 font-semibold">
        ${(item.priceAfterDiscount * item.cartQuantity).toFixed(2)}
      </td>

      <td className="py-4 px-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(removeFromCart(item._id))}
            className="w-8 h-8 flex items-center justify-center rounded bg-red-500 text-white hover:bg-red-600"
          >
            -
          </button>

          <button
          disabled={item.cartQuantity==item.quantity}
            onClick={() => dispatch(addToCart(item))}
            className="w-8 h-8 disabled:opacity-20 flex items-center justify-center rounded bg-teal-500 text-white hover:bg-teal-600"
          >
            +
          </button>
        </div>
      </td>
    </tr>
  ));

  return (
    <div className="max-w-6xl mx-auto mt-28 px-4">

      <h1 className="text-3xl font-bold mb-6 text-gray-800">Shopping Cart</h1>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full text-left">

            <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
              <tr>
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-3">Product</th>
                <th className="py-3 px-3">Image</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3">Discount</th>
                <th className="py-3 px-3">Qty</th>
                <th className="py-3 px-3">Total</th>
                <th className="py-3 px-3">Actions</th>
              </tr>
            </thead>

            <tbody>{tableItems}</tbody>

            <tfoot className="bg-gray-50 font-semibold text-gray-700">
              <tr>
                <td colSpan={3}></td>

                <td colSpan={2} className="py-4">
                  Items: {items.length}
                </td>

                <td colSpan={1}>Total: ${totalPrice.toFixed(2)}</td>

                <td colSpan={2} className="text-green-600">
                  Final: ${totalPriceAfterDiscount.toFixed(2)}
                </td>
              </tr>
            </tfoot>

          </table>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">

        <button
          onClick={() => dispatch(clear())}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Clear Cart
        </button>

        <button
          className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
        >
          Checkout
        </button>

      </div>
    </div>
  );
}
