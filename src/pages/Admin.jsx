import React, { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import toast from "react-hot-toast";

const Admin = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (role == null || token == null) {
      navigate("/adminLogin");
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.clear();

      // Optionally clear Firebase Auth session
      auth
        .signOut()
        .then(() => {
          toast.success("Logged out successfully");
          navigate("/login"); // Redirect to login page
        })
        .catch((error) => {
          toast.error("Error logging out: " + error.message);
        });
    } catch (error) {
      toast.error("Error logging out: " + error.message);
    }
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-100">
        <div className="px-4">
          <div className="flex items-center mb-4">
            <img
              className="w-full pt-4 object-contain"
              src="/nimantran logo.png"
              alt=""
            />
          </div>
          <nav className="space-y-2 pt-5">
            <Link
              to="/admin/dashboard"
              className={`flex items-center px-4 py-2 text-gray-700 rounded-md ${
                currentPath === "/admin/dashboard" ? "bg-gray-200" : ""
              }`}
            >
              <span className="mr-2">🏠</span> Dashboard
            </Link>

            <Link
              to="/admin/userDetails"
              className={`flex items-center px-4 py-2 text-gray-700 rounded-md ${
                currentPath === "/admin/userDetails" ? "bg-gray-200" : ""
              }`}
            >
              <span className="mr-2">👥</span> Users
            </Link>
            <Link
              to="/admin/eventlist"
              className={`flex items-center px-4 py-2 text-gray-700 rounded-md ${
                currentPath === "/admin/eventlist" ? "bg-gray-200" : ""
              }`}
            >
              <span className="mr-2">🎊</span> Events
            </Link>
            <Link
              to="/admin/credits"
              className={`flex items-center px-4 py-2 text-gray-700 rounded-md ${
                currentPath === "/admin/credits" ? "bg-gray-200" : ""
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
              <span className="w-9 h-9 bg-slate-300 rounded-full flex justify-center items-center">
                A
              </span>
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
        </header>
        <div className="border-4 border-dashed border-gray-200 rounded-lg h-[80vh]">
          {/* components */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Admin;
