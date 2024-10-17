import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import Select from "react-select";
import { Country } from "country-state-city";

const CreateCustomerJSX = ({ showModal, setShowModal }) => {
  const token = localStorage.getItem("token");
  const [togglePassword, settogglePassword] = useState(false);
  const [passwordGenerationCount, setPasswordGenerationCount] = useState(0);
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

  const nameRef = useRef("");
  const mobileRef = useRef("");
  const passwordRef = useRef("");
  const emailRef = useRef("");
  const genderRef = useRef("");
  const dateOfBirthRef = useRef(null);
  const locationRef = useRef("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [dateOfBirthError, setDateOfBirthError] = useState("");
  const [genderError, setGenderError] = useState("");

  const validateName = (name) => {
    if (!name.trim()) {
      setNameError("Name is required");
    } else if (name.length < 3 || name.length > 20) {
      setNameError("Name must be between 3 and 20 characters");
    } else {
      setNameError("");
    }
  };

  const createCustomer = async () => {
    try {
      const newCustomer = {
        name: nameRef.current.value,
        mobile: selectedCountry.value + mobileRef.current.value,
        password: passwordRef.current.value,
        email: emailRef.current.value,
        gender: genderRef.current.value,
        dateOfBirth: dateOfBirthRef.current.value,
        location: locationRef.current.value,
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/client/create-customer`,
        newCustomer,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("New Customer Added Successfully");
      setShowModal(!showModal);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to create customer"
      );
    }
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&()_+\-=\[\]{};:'",.<>?/\\|`~#])[A-Za-z\d@$!%*?&()_+\-=\#[\]{};:'",.<>?/\\|`~]{8,}$/;

    if (!password.trim()) {
      setPasswordError("Password is required");
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character"
      );
    } else {
      setPasswordError("");
    }
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^\d{10}$/;
    if (!mobile.trim()) {
      setMobileError("Mobile number is required");
    } else if (!mobileRegex.test(mobile)) {
      setMobileError("Mobile number must be 10 digits");
    } else {
      setMobileError("");
    }
  };

  const validateGender = (gender) => {
    if (!gender.trim()) {
      setGenderError("Gender is required");
    } else if (!["Male", "Female", "Other"].includes(gender)) {
      setGenderError("Gender must be Male, Female, or Other");
    } else {
      setGenderError("");
    }
  };

  const validateDateOfBirth = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      setDateOfBirthError(
        "You must be at least 18 years old to create an account."
      );
    } else {
      setDateOfBirthError("");
    }
  };

  const handleKeyPress = (event) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    if (!/[0-9]/.test(keyValue)) {
      event.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    validateName(nameRef.current.value);
    validateMobile(mobileRef.current.value);
    validatePassword(passwordRef.current.value);
    validateGender(genderRef.current.value);
    validateDateOfBirth(dateOfBirthRef.current.value);

    if (
      !nameError &&
      !mobileError &&
      !passwordError &&
      !genderError &&
      !dateOfBirthError
    ) {
      await createCustomer();
    }
  };

  if (!showModal) return null;

  const generateRandomPassword = () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const specialChars = "@$!%*?&()_+-=[]{};'\",./<>?/\\|`~#";

    let password = "";
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    for (let i = 0; i < 4; i++) {
      const allChars = lowercase + uppercase + numbers + specialChars;
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    return password
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-8 w-2/3 max-h-full overflow-y-auto">
        <h3 className="text-2xl mb-4">Create New Customer</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block mb-2 after:content-['*'] after:ml-0.5 after:text-red-500">
                Name:
              </label>
              <input
                type="text"
                ref={nameRef}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
                onBlur={(e) => validateName(e.target.value)}
                onChange={(e) => validateName(e.target.value)}
              />
              {nameError && <p className="text-red-500">{nameError}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-2 after:content-['*'] after:ml-0.5 after:text-red-500">
                Mobile:
              </label>
              <div className="flex items-center">
                <div className="w-2/5">
                  <Select
                    options={countryOptions}
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    isSearchable
                    className="w-full" // Ensure it takes full width of its container
                  />
                </div>
                <div className="w-4/5 ml-2">
                  <input
                    type="tel"
                    ref={mobileRef}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                    onKeyPress={handleKeyPress}
                    onBlur={(e) => validateMobile(e.target.value)}
                    onChange={(e) => validateMobile(e.target.value)}
                  />
                </div>
              </div>

              {mobileError && <p className="text-red-500">{mobileError}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-2 after:content-['*'] after:ml-0.5 after:text-red-500">
                Password:
              </label>
              <div className="relative">
                <input
                  type={togglePassword ? "text" : "password"}
                  ref={passwordRef}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                  onBlur={(e) => validatePassword(e.target.value)}
                  onChange={(e) => validatePassword(e.target.value)}
                />
                <span
                  className="absolute bottom-2 right-9 cursor-pointer text-gray-400"
                  onClick={() => {
                    if (passwordGenerationCount < 5) {
                      const generatedPassword = generateRandomPassword();
                      passwordRef.current.value = generatedPassword;
                      validatePassword(generatedPassword);
                      setPasswordGenerationCount((prevCount) => prevCount + 1);
                    } else {
                      toast.error(
                        "Password generation limit reached (5 times)"
                      );
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faWandMagicSparkles} />
                </span>

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
              {passwordError && <p className="text-red-500">{passwordError}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-2 after:content-['*'] after:ml-0.5 after:text-red-500">
                Gender:
              </label>
              <select
                ref={genderRef}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
                onBlur={(e) => validateGender(e.target.value)}
                onChange={(e) => validateGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {genderError && <p className="text-red-500">{genderError}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-2 ">Date of Birth:</label>
              <input
                type="date"
                ref={dateOfBirthRef}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                onChange={(e) => validateDateOfBirth(e.target.value)}
              />
              {dateOfBirthError && (
                <p className="text-red-500">{dateOfBirthError}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block mb-2">Location:</label>
              <input
                type="text"
                ref={locationRef}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              disabled={
                nameError ||
                emailError ||
                passwordError ||
                mobileError ||
                genderError ||
                dateOfBirthError
              }
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCustomerJSX;
