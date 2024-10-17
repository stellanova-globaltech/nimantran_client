import React from "react";

export default function Loader({ text }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-[99]">
      <div className="w-16 h-16 border-4 border-t-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
      <p className="mt-4 text-white text-lg">{text}</p>
    </div>
  );
}
