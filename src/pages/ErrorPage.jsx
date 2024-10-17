import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 animate-gradient-x">
      <div className="text-center text-white animate-fade-in">
        <h1 className="text-9xl font-bold animate-bounce">404</h1>
        <p className="text-2xl my-4">Oops! The page you're looking for doesn't exist.</p>
        <Link to="/" className="inline-block px-6 py-3 mt-4 border-2 border-white rounded-lg text-lg transition-colors duration-300 hover:bg-white hover:text-red-500">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
