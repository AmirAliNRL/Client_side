import React from "react";
import { Bars } from "react-loader-spinner";

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Bars
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="loading-indicator"
      />
      <span className="ml-4 text-lg text-gray-600">Loading...</span>
    </div>
  );
}

export default Loading;
