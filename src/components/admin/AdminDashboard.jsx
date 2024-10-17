import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { Country } from "country-state-city";

const AdminDashboard = () => {
  const token = localStorage.getItem("token");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [acceptedRequestId, setAcceptedRequestId] = useState("");
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

  const handleMobileChange = (e) => {
    const mobileRegex = /^\d{10}$/;
    const isValid = mobileRegex.test(e.target.value);

    if (isValid) {
      setMobile(e.target.value);
    } else {
      setMobile(e.target.value);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_ADMIN}/getAllRequest`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRequests(response.data.data.reverse());
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Error fetching requests");
    }
  };

  const createClient = async (e) => {
    e.preventDefault();
    try {
      if (!mobile || !password || !name) {
        toast.dismiss();
        toast.error("Enter all necessary fields");
        return;
      }
      const { data } = await axios.post(
        `${process.env.REACT_APP_ADMIN}/create-client`,
        { mobile: selectedCountry.value + mobile, password, name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data?.flag) {
        toast.success(data.message);
        setIsModalOpen(false);
        setMobile("");
        setPassword("");
        setName("");
        fetchRequests(); // Fetch requests again after creating client
        return;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      setShowWarningModal(false);
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/admin/acceptCreditRequest/${requestId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data?.success) {
        toast.success(data.message);
        fetchRequests(); // Refresh requests after accepting
      }
    } catch (error) {
      toast.error("Error accepting request");
    }
    setAcceptedRequestId("");
  };

  const handleRejectRequest = async (requestId) => {
    try {
      setShowWarningModal(false);
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/admin/rejectCreditRequest/${requestId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data?.success) {
        toast.success(data.message);
        fetchRequests(); // Refresh requests after accepting
      }
    } catch (error) {
      toast.error("Error accepting request");
    }
    setAcceptedRequestId("");
  };
  const handleFiltersStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };
  const handleKeyPress = (event) => {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  };
  const filteredData =
    selectedStatus === "All"
      ? requests
      : requests.filter((item) => item.status === selectedStatus.toLowerCase());

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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-wrap space-x-4">
          <button
            className={`px-6 py-2 text-lg font-semibold rounded-lg bg-blue-500 text-white`}
            onClick={() => setIsModalOpen(true)}
          >
            Create Client
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed z-30 inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md flex flex-col items-center p-6">
            <h2 className="text-xl font-bold mb-4">Create Client</h2>
            <form onSubmit={createClient} className="w-full flex flex-col ">
              <div className="mb-4 flex flex-col gap-y-1.5">
                <label htmlFor="name" className=" text-gray-700 ">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full px-2 py-2 m-0 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-4 flex flex-col gap-y-1.5">
                <div className="flex items-center">
                  {/* Country Code Dropdown */}
                  <div className="w-2/5">
                    <Select
                      options={countryOptions}
                      value={selectedCountry}
                      onChange={handleCountryChange}
                      isSearchable
                      className="w-full" // Ensure it takes full width of its container
                    />
                  </div>

                  {/* Mobile Number Input */}
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
              </div>
              <div className="mb-4 flex flex-col gap-y-1.5">
                <label htmlFor="temp_password" className=" text-gray-700 ">
                  Temporary Password
                </label>
                <div className="relative w-full">
                  <input
                    id="temp_password"
                    type="text"
                    className="w-full m-0 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    onClick={() => setPassword(generateRandomPassword())}
                    className=" absolute right-2 top-2"
                  >
                    <FontAwesomeIcon
                      icon={faWandMagicSparkles}
                    ></FontAwesomeIcon>
                  </button>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-6 py-2 font-semibold rounded-lg bg-gray-200 text-gray-800"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 font-semibold rounded-lg bg-blue-500 text-white"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showWarningModal && (
        <div className="fixed z-30 inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center">
              Do you want to {acceptedRequestId.split("#")[1]} Request ?
            </h2>
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                className="px-6 py-2 font-semibold rounded-lg bg-gray-200 text-gray-800"
                onClick={() => {
                  setAcceptedRequestId("");
                  setShowWarningModal(false);
                }}
              >
                Cancel
              </button>
              {acceptedRequestId.split("#")[1] === "accept" ? (
                <button
                  onClick={() =>
                    handleAcceptRequest(acceptedRequestId.split("#")[0])
                  }
                  className="px-6 py-2 font-semibold rounded-lg bg-blue-500 text-white"
                >
                  Accept
                </button>
              ) : (
                <button
                  onClick={() =>
                    handleRejectRequest(acceptedRequestId.split("#")[0])
                  }
                  className="px-6 py-2 font-semibold rounded-lg bg-red-500 text-white"
                >
                  Reject
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Requests Table */}
      <div className="overflow-auto mt-6 h-[53vh] border">
        <table className="min-w-full  bg-white border border-gray-200 border-collapse rounded-lg shadow-md">
          <thead className="sticky top-0">
            <tr>
              <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">
                User Name
              </th>
              <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">
                Date
              </th>
              <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">
                Credits
              </th>
              <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">
                <label>Status : </label>
                <select
                  className="border px-4 py-1  box-border rounded-md bg-gray-300"
                  onChange={(e) => handleFiltersStatusChange(e)}
                >
                  <option value="All">All</option>
                  <option value="Completed" className="text-green-500">
                    Completed
                  </option>
                  <option value="Pending" className="text-yellow-500">
                    Pending
                  </option>
                  <option value="rejected" className="text-red-500">
                    rejected
                  </option>
                </select>
              </th>
              <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((request) => (
              <tr key={request._id}>
                <td className="py-2 px-4 border-b text-center border-gray-200">
                  {request?.By?.name}
                </td>
                <td className="py-2 px-4 border-b text-center border-gray-200">
                  {new Date(request.createdAt).toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b text-center border-gray-200">
                  {request.credits}
                </td>
                <td className="py-2 px-4 border-b text-center border-gray-200">
                  {request.status}
                </td>
                <td className="py-2 px-4 border-b text-center border-gray-200">
                  {request.status === "pending" && (
                    <div>
                      <button
                        className="px-4 py-1 bg-blue-500 text-white rounded-lg"
                        onClick={() => {
                          setShowWarningModal(true);
                          setAcceptedRequestId(request._id + "#accept");
                        }}
                      >
                        Accept
                      </button>
                      <button
                        className="px-4 py-1 bg-red-500 text-white rounded-lg ml-2"
                        onClick={() => {
                          setShowWarningModal(true);
                          setAcceptedRequestId(request._id + "#reject");
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
