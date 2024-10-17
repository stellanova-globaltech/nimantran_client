import React from "react";
import { Link, Outlet } from "react-router-dom";

const CustomerDashboard = () => {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-100">
        <div className="p-4">
          <div className="flex items-center mb-4">
            <svg
              className="h-8 w-8 text-blue-600"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L2 7v7c0 5 3.58 9.33 8 9.93 4.42-.6 8-4.93 8-9.93V7L12 2z" />
            </svg>
            <span className="text-xl font-bold ml-2">Dashboard</span>
          </div>
          <nav className="space-y-2">
            <Link
              to="/client/dashboard"
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 rounded-md"
            >
              <span className="mr-2">🏠</span> Dashboard
            </Link>
            <Link
              to="/client/customers"
              className="flex items-center px-4 py-2 text-gray-700 rounded-md"
            >
              <span className="mr-2">👥</span> End Users
            </Link>
            <Link
              to="/client/events"
              className="flex items-center px-4 py-2 text-gray-700 rounded-md"
            >
              <span className="mr-2">🎊</span> Events
            </Link>
            <Link
              to="/client/credits"
              className="flex items-center px-4 py-2 text-gray-700 rounded-md"
            >
              <span className="mr-2">💲</span> Credits
            </Link>
            <Link
              to="/client/customers"
              className="flex items-center px-4 py-2 text-gray-700 rounded-md"
            >
              <span className="mr-2">🤵🏻</span> Customers
            </Link>
          </nav>
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-600 px-4">
              Your teams
            </h3>
            <nav className="mt-2 space-y-2">
              <Link
                to="/client/teams/heroicons"
                className="flex items-center px-4 py-2 text-gray-700 rounded-md"
              >
                <span className="h-4 w-4 mr-2 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                  H
                </span>{" "}
                Heroicons
              </Link>
              <Link
                to="/client/teams/tailwind-labs"
                className="flex items-center px-4 py-2 text-gray-700 rounded-md"
              >
                <span className="h-4 w-4 mr-2 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                  T
                </span>{" "}
                Tailwind Labs
              </Link>
              <Link
                to="/client/teams/workcation"
                className="flex items-center px-4 py-2 text-gray-700 rounded-md"
              >
                <span className="h-4 w-4 mr-2 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                  W
                </span>{" "}
                Workcation
              </Link>
            </nav>
          </div>
        </div>
      </aside>
      <main className="flex-1 p-6 bg-white">
        <header className="flex items-center justify-between mb-6">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 border rounded-md w-1/3"
          />
          <div className="flex items-center">
            <button className="p-2 mr-4 rounded-full hover:bg-gray-200">
              <svg
                className="h-6 w-6 text-gray-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 22c1.11 0 2-.9 2-2h-4c0 1.1.89 2 2 2zM18.29 17.29L19.7 15.88C20.78 14.79 21.5 13.33 21.5 11.67V8.5C21.5 4.91 18.59 2 15 2S8.5 4.91 8.5 8.5v3.17c0 1.66.72 3.12 1.79 4.21l1.41 1.41C10.28 18.04 9.5 19.45 9.5 21h7c0-1.55-.78-2.96-1.97-3.71z" />
              </svg>
            </button>
            <div className="flex items-center">
              <img
                className="h-8 w-8 rounded-full mr-2"
                src="https://via.placeholder.com/32"
                alt="Profile"
              />
              <span>Tom Cook</span>
            </div>
          </div>
        </header>
        <div className="border-4 border-dashed border-gray-200 rounded-lg h-[80vh]">
          {/* components */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
