import React from "react";

const LoadingPage = () => {
  return (
    <div className="absolute inset-0 flex justify-center items-center">
      <div className="w-10 h-10 border-4 border-t-orange-300 border-l-green-300 border-b-red-300 border-r-yellow-200 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingPage;
