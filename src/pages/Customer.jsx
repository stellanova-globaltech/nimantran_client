import React, { useEffect } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const Customer = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const role = localStorage.getItem("role");
  const getLinkClasses = (path) => {
    return location.pathname === path
      ? "bg-blue-500 text-white px-4 py-2 rounded-md"
      : "bg-gray-200 text-gray-700 px-4 py-2 rounded-md";
  };
  const [params] = useSearchParams();
  const customerId = params.get("customerId");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // useEffect(() => {
  //   if (location.pathname === `/customer` && customerId) {
  //     navigate(`/customer/profile?customerId=${customerId}`);
  //   }
  // }, [location.pathname, customerId, navigate]);

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
              to={`/customer/profile?customerId=${customerId}`}
              className={`flex items-center px-4 py-2 text-gray-700 rounded-md ${
                currentPath === `/customer/profile` ? "bg-gray-200" : ""
              }`}
            >
              <span className="mr-2">🏠</span> Dashboard
            </Link>

            <Link
              to={`/customer/editProfile?customerId=${customerId}`}
              className={`flex items-center px-4 py-2 text-gray-700 rounded-md ${
                currentPath === `/customer/editProfile` ? "bg-gray-200" : ""
              }`}
            >
              <span className="mr-2">👥</span> Edit Profile
            </Link>
            <Link
              to={`/customer/events?customerId=${customerId}`}
              className={`flex items-center px-4 py-2 text-gray-700 rounded-md ${
                currentPath === "/customer/events" ? "bg-gray-200" : ""
              }`}
            >
              <span className="mr-2">🎊</span> Events
            </Link>
            <Link
              to={`/customer/credits?customerId=${customerId}`}
              className={`flex items-center px-4 py-2 text-gray-700 rounded-md ${
                currentPath === "/customer/credits" ? "bg-gray-200" : ""
              }`}
            >
              <span className="mr-2">💲</span> Credits
            </Link>
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-6 bg-white">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center w-full justify-start">
            {role !== "customer" && (
              <button
                className="p-2 rounded-md border-2 flex items-center justify-center"
                onClick={() => navigate("/admin/userDetails")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="w-4 h-4 mr-2" // Adjust the size of the icon and add margin to the right
                >
                  <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                </svg>
                <p className="w-full">Back {role} Dashboard</p>
              </button>
            )}
          </div>
          <div className="flex items-center w-full justify-end">
            <div className="flex items-center">
              {/* <img className="h-8 w-8 rounded-full mr-2" src="https://via.placeholder.com/32" alt="Profile" /> */}
              <span className="p-2 rounded-md mr-2 border-2 justify-center items-center flex">
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
                  onClick={() => handleLogout()}
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

export default Customer;
