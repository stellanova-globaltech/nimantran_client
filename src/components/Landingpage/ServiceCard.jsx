import React from "react";

const ServiceCard = ({ title, description, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <div className="text-pink-500 text-3xl mb-4">{icon}</div>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-700 mb-4">{description}</p>
      <button className="bg-pink-500 text-white py-2 px-4 rounded-full">
        Know More
      </button>
    </div>
  );
};

export default ServiceCard;
