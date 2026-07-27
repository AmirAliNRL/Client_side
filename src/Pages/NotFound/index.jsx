// NotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate=useNavigate()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <h2 className="text-2xl mt-4 text-gray-600">Page Not Found</h2>
      <p className="mt-2 text-gray-500">Sorry, the page you are looking for does not exist.</p>
      <button onClick={()=>navigate(-1)} href="/" className="mt-6 text-teal-600 hover:underline">
        Go Back Home
      </button>
    </div>
  );
}

export default NotFound;
