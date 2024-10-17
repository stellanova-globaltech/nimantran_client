import React, { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const Client = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (role == null || token == null) {
      navigate("/login");
    }
  }, []);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-100">
        <div className="px-4">
          <div className="flex items-center mb-4">
            <img
              className="w-44 cursor-pointer"
              src="/nimantran logo.png"
              alt=""
              onClick={() => navigate("/client/dashboard")}
            />
          </div>
          <nav className="space-y-2 pt-5">
            <Link
              to="/client/dashboard"
              className={`flex items-center px-4 py-2 text-gray-700 rounded-md ${
                currentPath === "/client/dashboard" ? "bg-gray-200" : ""
              }`}
            >
              <span className="mr-2">🏠</span> Dashboard
            </Link>

            <Link
              to="/client/customers"
              className={`flex items-center px-4 py-2 text-gray-700 rounded-md ${
                currentPath === "/client/customers" ? "bg-gray-200" : ""
              }`}
            >
              <span className="mr-2">👥</span> My Customers
            </Link>
            <Link
              to="/client/eventlist"
              className={`flex items-center px-4 py-2 text-gray-700 rounded-md ${
                currentPath === "/client/eventlist" ? "bg-gray-200" : ""
              }`}
            >
              <span className="mr-2">🎊</span> Events
            </Link>
            <Link
              to="/client/credits"
              className={`flex items-center px-4 py-2 text-gray-700 rounded-md ${
                currentPath === "/client/credits" ? "bg-gray-200" : ""
              }`}
            >
              <span className="mr-2">💲</span> Credits
            </Link>
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-6 bg-white">
        <header className="flex items-center justify-end mb-6">
          <div className="flex items-center">
            <div className="flex items-center">
              {/* <img className="h-8 w-8 rounded-full mr-2" src="https://via.placeholder.com/32" alt="Profile" /> */}
              <span className="p-2 rounded-md mr-2 border-2 justify-center items-center flex cursor-pointer">
                {role} Account
              </span>
              <div className="h-full flex items-center justify-center">
                <div
                  className="bg-black text-white text-center mx-2 py-2 px-4 rounded-lg cursor-pointer"
                  onClick={() => navigate("/event/createEvent")}
                >
                  Create Event
                </div>
              </div>
              <div className="h-full flex items-center justify-center">
                <div
                  className="bg-black text-white text-center mx-2 py-2 px-4 rounded-lg cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </div>
              </div>
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

export default Client;
