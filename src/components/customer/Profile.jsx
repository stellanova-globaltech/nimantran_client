import axios from "axios";
import React, { useEffect, useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
const Profile = () => {
  const token = localStorage.getItem("token");
  const [customerInfo, setCustomerInfo] = useState({});
  const [params] = useSearchParams();
  const id = params.get("customerId");
  const [credits, setCredits] = useState(0);
  const [purchaseRequestModal, setPurchaseRequestModal] = useState(false);
  const [requests, setRequests] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortOrder, setSortOrder] = useState(false);

  const requestCreditFromClient = async (e) => {
    setPurchaseRequestModal(false);
    try {
      e.preventDefault();
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/users/purchase-request-from-client`,
        { credits },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Request send to Client");
      setCredits(0);
      fetchCustomerDetails();
      fetchRequests();
    } catch (error) {
      toast.error("Error buying credits");
    }
  };

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/customers/customers-requests?customerId=${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRequests(data.data);
      const sorted = [...data?.data].sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      });
      
      setFilteredData(sorted);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch requests");
    }
  };

  const fetchCustomerDetails = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/customers/customerInfo/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCustomerInfo(data?.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchCustomerDetails();
    fetchRequests();
  }, []);

  const handleKeyPress = (event) => {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  };

  const handleFiltersStatusChange = (e) => {
    const status = e.target.value;
    if (status === "All") {
      setFilteredData(requests);
    } else {
      setFilteredData(requests.filter((request) => request.status === status));
    }
  };
  const sortByDate = () => {
    const sorted = [...filteredData].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder ? dateA - dateB : dateB - dateA;
    });
    setFilteredData(sorted);
    setSortOrder((prev) => !prev);
  };

  return (
    <div className="w-full flex p-8 gap-x-4">
      <div className="bg-white rounded-lg shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] p-8 flex flex-col gap-y-4 max-w-[450px] w-full">
        <div className="bg-blue-50 py-6 px-4 rounded-lg flex items-center gap-x-2">
          <h1 className="text-xl font-semibold text-blue-500">
            Customer Name:
          </h1>
          <p className="text-lg">{customerInfo.name}</p>
        </div>
        <div className="bg-blue-50 py-6 px-4 rounded-lg flex items-center gap-x-2">
          <h1 className="text-xl font-semibold text-blue-500">Mobile:</h1>
          <p className="text-lg">{customerInfo.mobile}</p>
        </div>
        <div className="bg-blue-50 py-6 px-4 rounded-lg flex items-center gap-x-2">
          <h1 className="text-xl font-semibold text-blue-500">Credits:</h1>
          <p className="text-lg">{customerInfo.credits}</p>
        </div>
        <div className="bg-blue-50 py-6 px-4 rounded-lg flex items-center gap-x-2">
          <h1 className="text-xl font-semibold text-blue-500">Gender:</h1>
          <p className="text-lg">{customerInfo.gender}</p>
        </div>
        <div className="bg-blue-50 py-6 px-4 rounded-lg flex items-center gap-x-2">
          <h1 className="text-xl font-semibold text-blue-500">Location:</h1>
          <p className="text-lg">{customerInfo.location}</p>
        </div>
      </div>
      <div className="w-full">
        <div className="w-full">
          {localStorage.getItem("role") === "customer" && (
            <button
              type="button"
              className="text-white bg-blue-500 w-full rounded-md py-2.5"
              onClick={() => setPurchaseRequestModal(true)}
            >
              Request Credit from Client
            </button>
          )}
          {purchaseRequestModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg p-8 w-1/3">
                <h3 className="text-2xl mb-4">Request Credits from Client</h3>
                <form onSubmit={(e) => requestCreditFromClient(e)}>
                  <div className="mb-4">
                    <label className="block mb-2">Credits:</label>
                    <input
                      type="number"
                      value={credits}
                      onKeyPress={handleKeyPress}
                      onChange={(e) => setCredits(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      required
                      min={1}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setPurchaseRequestModal(false);
                        setCredits(0);
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                      Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
        <div className="m-8">
          <h2 className="text-2xl font-semibold mb-4">Requests To Client</h2>
          <div
            className="overflow-y-auto no-scrollbar border"
            style={{ height: "40vh" }}
          >
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-200 sticky top-[-1px]">
                <tr>
                  <th className="py-2 px-4 border-b">Credits</th>
                  <th className="py-2 px-4 border-b">
                    <label>Status : </label>
                    <select
                      className="border px-4 py-1 box-border rounded-md bg-gray-300"
                      onChange={(e) => handleFiltersStatusChange(e)}
                    >
                      <option value="All">All</option>
                      <option value="completed" className="text-green-500">
                        Completed
                      </option>
                      <option value="pending" className="text-yellow-500">
                        Pending
                      </option>
                      <option value="rejected" className="text-red-500">
                        Rejected
                      </option>
                    </select>
                  </th>
                  <th className="py-2 px-4 border-b">
                    Date
                    <button onClick={sortByDate}>
                      <FontAwesomeIcon
                        className={`rotate-90 mx-1 ${
                          sortOrder === "asc" ? "transform rotate-180" : ""
                        }`}
                        icon={faArrowRightArrowLeft}
                      />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {requests.length > 0 ? (
                  filteredData.map((request) => (
                    <tr key={request._id}>
                      <td className="py-2 text-center px-4 border-b">
                        {request?.credits}
                      </td>
                      <td className="py-2 text-center px-4 border-b">
                        {request?.status}
                      </td>
                      <td className="py-2 text-center px-4 border-b">
                        {new Date(request?.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-2 px-4 border-b text-center" colSpan="5">
                      No requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
