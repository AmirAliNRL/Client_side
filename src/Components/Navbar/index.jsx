import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCartPlus } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../Store/AuthSlice";
import FetchData from "../../Utils/FetchData";

export default function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const cartLength = useSelector((state) => state.cart.items).length;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchInp, setSearchInp] = useState("");
  const [searchResult, setSearchResult] = useState();

  useEffect(() => {
    window.addEventListener('click',(e)=>{
      if(!e.target.closest('.searchInp')){
        setSearchInp('')
        searchResult('')
      }
    })
    if (searchInp.length < 3) return;
    (async () => {
      const result = await FetchData(`search?q=${searchInp}`);
      if (!result.success) {
        setSearchResult("notFound");
      } else {
        setSearchResult(result.data);
      }
    })();
  }, [searchInp]);

  const categoryItems = searchResult?.categories?.map((item) => (
    <div
      key={item._id}
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
      onClick={() =>
        navigate(`/products/${item._id}/${item.title.replaceAll(" ", "-")}`)
      }
    >
      <img
        src={import.meta.env.VITE_BASE_FILE + item.image}
        className="w-10 h-10 rounded-md object-cover"
      />
      <span className="text-sm font-medium text-gray-700">{item.title}</span>
    </div>
  ));

  const productsItems = searchResult?.products?.map((item) => (
    <div
      key={item._id}
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
      onClick={() =>
        navigate(
          `/product-details/${item._id}/${item.title.replaceAll(" ", "-")}`
        )
      }
    >
      <img
        src={import.meta.env.VITE_BASE_FILE + item.images[0]}
        className="w-10 h-10 rounded-md object-cover"
      />
      <span className="text-sm font-medium text-gray-700">{item.title}</span>
    </div>
  ));

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-indigo-500 bg-clip-text text-transparent"
        >
          E-Commerce
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 font-medium text-gray-700">
          <li>
            <Link className="hover:text-teal-600 transition" to="/">
              Home
            </Link>
          </li>

          <li>
            <Link
              className="hover:text-teal-600 transition"
              to="/products/all/all-category"
            >
              Products
            </Link>
          </li>

          {token ? (
            <button
              onClick={() => dispatch(logout())}
              className="text-red-500 hover:text-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/auth"
              className="px-4 py-1.5 rounded-full bg-teal-500 text-white hover:bg-teal-600 transition"
            >
              Login
            </Link>
          )}
        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-5">

          {/* Search */}
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search products..."
              value={searchInp}
              onChange={(e) => setSearchInp(e.target.value)}
              className="w-52 searchInp lg:w-64 bg-gray-100 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />

            {searchInp && (
              <div className="absolute top-12 w-full bg-white border border-gray-200 shadow-xl rounded-xl p-3 max-h-72 overflow-y-auto animate-fadeIn">

                {searchInp.length < 3 && (
                  <p className="text-sm text-gray-400">Min 3 characters</p>
                )}

                {searchInp.length >= 3 && !searchResult && (
                  <p className="text-sm text-gray-400">Searching...</p>
                )}

                {categoryItems?.length > 0 && (
                  <>
                    <p className="text-xs text-gray-400 mt-2 mb-1">
                      Categories
                    </p>
                    {categoryItems}
                  </>
                )}

                {productsItems?.length > 0 && (
                  <>
                    <p className="text-xs text-gray-400 mt-3 mb-1">
                      Products
                    </p>
                    {productsItems}
                  </>
                )}

                {searchResult === "notFound" && (
                  <p className="text-sm text-gray-400">No results found</p>
                )}
              </div>
            )}
          </div>

          {/* Profile */}
          {token && (
            <Link
              to="/profile"
              className="text-xl text-gray-700 hover:text-teal-600 transition"
            >
              <CgProfile />
            </Link>
          )}

          {/* Cart */}
          <div onClick={()=>navigate('/cart')} className="relative text-xl text-gray-700 hover:text-teal-600 transition cursor-pointer">
            {cartLength !== 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-1.5 rounded-full">
                {cartLength}
              </span>
            )}
            <FaCartPlus />
          </div>
        </div>
      </div>
    </nav>
  );
}
