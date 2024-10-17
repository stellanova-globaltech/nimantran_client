import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { auth } from "../../firebaseConfig"; // Firebase config
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import Loader from "../Other/Loader/Loader";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState({ mobile: "", password: "", otp: "" });
  const [togglePassword, setTogglePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const navigate = useNavigate();

  const handleMobileChange = (e) => {
    const mobileRegex = /^\d{10,}$/;
    const isValid = mobileRegex.test(e.target.value);

    if (isValid) {
      setMobile(e.target.value);
      setError((prevError) => ({ ...prevError, mobile: "" }));
    } else {
      setMobile(e.target.value);
      setError((prevError) => ({
        ...prevError,
        mobile: "Not a valid mobile number",
      }));
    }
  };

  const onCaptchVerify = () => {
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container", // Attach to div ID here
          {
            size: "invisible", // or 'normal' if you want a visible widget
            callback: (response) => {
              console.log("reCAPTCHA verified");
              handlePhoneLogin(); // Proceed to login if reCAPTCHA is successful
            },
            "expired-callback": () => {
              console.log("reCAPTCHA expired. Please solve it again.");
              window.recaptchaVerifier.render(); // Re-render reCAPTCHA if expired
            },
          }
        );
      }
      window.recaptchaVerifier.render(); // Ensure that reCAPTCHA is rendered
    } catch (error) {
      toast.error("Failed to Pass Captcha");
    }
  };

  const handlePhoneLogin = async () => {
    try {
      onCaptchVerify();
      const appVerifier = window.recaptchaVerifier;
      const phoneNumberWithCountryCode = `+${mobile}`;

      const confimation = await signInWithPhoneNumber(
        auth,
        phoneNumberWithCountryCode,
        appVerifier
      );
      if (confimation) {
        setConfirmationResult(confimation);
        setShowOtpModal(true);
        setError((prevError) => ({ ...prevError, otp: "" }));
        return true;
      }
      setError((prevError) => ({
        ...prevError,
        otp: "Failed to send OTP. Please try again.",
      }));

      return false;
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const handleOtpVerification = () => {
    try {
      if (confirmationResult) {
        confirmationResult
          .confirm(otp)
          .then(() => {
            setError((prevError) => ({ ...prevError, otp: "" }));
            navigate(`/client/dashboard`); // OTP verified, navigate to dashboard
          })
          .catch(() => {
            setError((prevError) => ({
              ...prevError,
              otp: "Invalid OTP. Please try again.",
            }));
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loginUser = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/users/login`,
        { mobile, password }
      );

      const { data } = response.data;
      if (response.status === 200 && data) {
        setLoading(false);
        const verified = await handlePhoneLogin(); // Call phone login after the successful backend response
        if (verified) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("mobile", data.mobile);
          localStorage.setItem("_id", data._id);
          localStorage.setItem("role", data.role);

          toast.success(response.data.message);
        }
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      {loading && <Loader text="Wait while login" />}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md">
        <div className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src={"/nimantran logo.png"}
              alt="Logo"
              className="h-16 w-auto"
            />
          </div>

          <form onSubmit={loginUser} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              Login
            </h2>
            <div>
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile
              </label>
              <input
                type="text"
                inputMode="numeric"
                id="mobile"
                placeholder="Enter your mobile number"
                value={mobile}
                onChange={handleMobileChange}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none ${
                  error.mobile
                    ? "focus:ring-red-500 focus:border-red-500"
                    : "focus:ring-blue-500 focus:border-blue-500"
                } sm:text-sm transition duration-150 ease-in-out`}
              />
              {error.mobile && (
                <p className="text-red-500 text-sm mt-1">{error.mobile}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={togglePassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <span
                  className="absolute bottom-2 right-2.5 cursor-pointer text-blue-500"
                  onClick={() => setTogglePassword((prev) => !prev)}
                >
                  {togglePassword ? (
                    <FontAwesomeIcon icon={faEye} />
                  ) : (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  )}
                </span>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                Login
              </button>
            </div>

            {/* Recaptcha */}
            <div id="recaptcha-container" className="mt-4"></div>

            <p className="text-sm text-gray-600 text-center mt-4">
              Don't have an account?{" "}
              <Link
                to={"/register"}
                className="text-blue-400 hover:text-blue-600"
              >
                Register Now
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-2xl font-bold text-center mb-4">Enter OTP</h2>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            {error.otp && <p className="text-red-500 text-sm">{error.otp}</p>}
            <button
              onClick={handleOtpVerification}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Confirm OTP
            </button>
            <button
              onClick={() => setShowOtpModal(false)}
              className="w-full bg-blue-500 text-white py-2 mt-4 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
