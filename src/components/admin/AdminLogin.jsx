import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/AdminLogin.css"; // Ensure you save the CSS in this file
import toast from "react-hot-toast";
import Loader from "../Other/Loader/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const AdminLogin = () => {
  const [mobile, setmobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [togglePassword, settogglePassword] = useState(false);

  const navigate = useNavigate();

  const loginUser = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_ADMIN}/login`,
        { mobile, password }
      );
      localStorage.setItem("token", data?.data?.token);
      localStorage.setItem("mobile", data?.data?.mobile);
      localStorage.setItem("_id", data?.data?._id);
      localStorage.setItem("role", data?.data?.role);
      if (!data?.data?.token) {
        navigate("/");
        return;
      }
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error("Error logging in");
    }
    setLoading(false);
  };

  return (
    <>
      {loading && <Loader text="Wait while login" />}
      <div className="w-full h-screen flex justify-center items-center">
        <div className="admin-login-container ">
          <div className="login-avatar">
            <img
              src="https://png.pngtree.com/png-clipart/20191122/original/pngtree-user-icon-isolated-on-abstract-background-png-image_5192004.jpg"
              alt="Avatar"
            />
          </div>
          <h2>Login</h2>
          <div className=" relative w-full">
          <input
            type="text"
            placeholder="mobile"
            value={mobile}
            onChange={(e) => setmobile(e.target.value)}
          />
          </div>
          <div className=" relative w-full">
            <input
              type={`${togglePassword ? "text" : "password"}`}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className=" absolute cursor-pointer text-blue-500 right-2 top-6"
              onClick={() => settogglePassword((prev) => !prev)}
            >
              {togglePassword ? (
                <FontAwesomeIcon icon={faEye} />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} />
              )}
            </span>
          </div>
          <div className=" relative w-full ml-5">
          <button onClick={loginUser}>Login</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
