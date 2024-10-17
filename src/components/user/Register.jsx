import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Country } from "country-state-city";
import Select from "react-select";

const Register = () => {
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [error, setError] = useState({ mobile: "", password: "" });
  const [role, setRole] = useState("client"); // default role for registration
  const [clientId, setClientId] = useState("");
  const [togglePassword, settogglePassword] = useState(false);
  const [ctogglePassword, setCtogglePassword] = useState(false);
  const [countryOptions, setCountryOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({});

  useEffect(() => {
    const allCountries = Country.getAllCountries().map((country) => ({
      label: `(${country.phonecode}) ${country.isoCode}`,
      value: country.phonecode,
      code: country.isoCode,
    }));
    setCountryOptions(allCountries);
    setSelectedCountry(allCountries[0]);
  }, []);

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
  };

  const navigate = useNavigate();
  const handleKeyPress = (event) => {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  };
  const handleMobileChange = (e) => {
    const mobileRegex = /^\d{10}$/;
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

  const validatePassword = (value) => {
    if (password !== value) {
      setError((prevError) => ({
        ...prevError,
        password: "Password must be same as Confirm Password",
      }));
      return;
    }
    if (value.length < 6) {
      setError((prevError) => ({
        ...prevError,
        password: "Password must be at least 6 characters long",
      }));
      return;
    }
    setError((prevError) => ({ ...prevError, password: "" }));
  };

  const registerUser = async (event) => {
    event.preventDefault();
    if (error.mobile || error.password) {
      return; // Exit the function if there are errors
    }
    try {
      const user = {
        mobile: selectedCountry.value + mobile,
        password,
        role,
        name,
      };
      if (role === "customer") {
        user.clientId = clientId;
      }
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/users/register`,
        user
      );

      if (!data) {
        toast.error(data.message);
        return;
      }
      toast.success(data?.message);
      navigate("/login");
    } catch (error) {
      if (error.response) {
        // Handle API response error
        toast.error(error.response.data.message);
      } else {
        // Handle other errors (network error, timeout, etc.)
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-3">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md">
        {/* Logo Section */}
        <div className="flex justify-center mt-6">
          <img src="/nimantran logo.png" alt="Logo" className="h-16" />
        </div>
        {/* Form Section */}
        <div className="px-7 py-3">
          <form onSubmit={registerUser} className="space-y-5">
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              Registration
            </h2>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
              />
            </div>
            <div>
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile Number
              </label>
              <div className="flex items-center">
                <div className="w-2/5">
                  <Select
                    options={countryOptions}
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    isSearchable
                    className="w-full"
                  />
                </div>
                <div className="w-4/5 ml-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    id="mobile"
                    placeholder="Enter your mobile number"
                    value={mobile}
                    onChange={(e) => handleMobileChange(e)}
                    onKeyPress={handleKeyPress}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                  />
                </div>
              </div>
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
                  type={`${togglePassword ? "text" : "password"}`}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none ${
                    error.password
                      ? "focus:ring-red-500 focus:border-red-500"
                      : "focus:ring-blue-500 focus:border-blue-500"
                  } sm:text-sm transition duration-150 ease-in-out`}
                />
                <span
                  className="absolute bottom-2 right-2.5 cursor-pointer text-blue-500"
                  onClick={() => settogglePassword((prev) => !prev)}
                >
                  {togglePassword ? (
                    <FontAwesomeIcon icon={faEye} />
                  ) : (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  )}
                </span>
              </div>
              {error.password && (
                <p className="text-red-500 text-sm mt-1">{error.password}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="cpassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={`${ctogglePassword ? "text" : "password"}`}
                  id="cpassword"
                  placeholder="Enter your password"
                  value={cpassword}
                  onChange={(e) => {
                    setCPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none ${
                    error.password
                      ? "focus:ring-red-500 focus:border-red-500"
                      : "focus:ring-blue-500 focus:border-blue-500"
                  } sm:text-sm transition duration-150 ease-in-out`}
                />
                <span
                  className="absolute bottom-2 right-2.5 cursor-pointer text-blue-500"
                  onClick={() => setCtogglePassword((prev) => !prev)}
                >
                  {ctogglePassword ? (
                    <FontAwesomeIcon icon={faEye} />
                  ) : (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  )}
                </span>
              </div>
            </div>
            {console.log(password, cpassword)}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
              >
                <option value="client">Client</option>
                <option value="customer">Customer</option>
              </select>
            </div>
            {role === "customer" && (
              <div>
                <label
                  htmlFor="clientId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Client ID
                </label>
                <input
                  type="text"
                  id="clientId"
                  placeholder="Enter your client ID"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                />
              </div>
            )}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                Register
              </button>
            </div>
          </form>
          <p className="text-sm text-gray-600 text-center mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
