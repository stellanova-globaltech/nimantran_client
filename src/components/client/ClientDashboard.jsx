import axios from "axios";
import React, { useState, useEffect } from "react";
import CreateCustomerJSX from "../Other/CreateCustomerModal/CreateCustomerModal";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";

const ClientDashboard = () => {
  const token = localStorage.getItem("token");
  const [clientInfo, setClientInfo] = useState({});
  const [createCustomerModal, showCreateCustomerModal] = useState(false);
  const [purchaseRequestModal, showPurchaseRequestModal] = useState(false);
  const [adminCredits, setAdminCredits] = useState(0);
  const [requests, setRequests] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState(false);

  // Fetch functions
  const fetchClientDetails = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/client`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setClientInfo(data?.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch client details"
      );
    }
  };

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/client/client-requests`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const SortedByDate = data?.data.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      });
      setRequests(SortedByDate);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch requests");
    }
  };

  useEffect(() => {
    fetchClientDetails();
    fetchRequests();
  }, []);

  const handleModalPurchaseRequest = () => {
    setAdminCredits(0);
    showPurchaseRequestModal(!purchaseRequestModal);
  };

  const requestCreditsFromAdmin = async (e) => {
    try {
      e.preventDefault();
      handleModalPurchaseRequest(); // Close modal even if the request fails
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/client/purchase-request-from-admin`,
        { credits: parseInt(adminCredits) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Request Sent Successfully");
      setAdminCredits(0);
      fetchClientDetails();
      fetchRequests();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to request credits"
      );
    }
  };

  const handleKeyPress = (event) => {
    const charCode = event.which || event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  };

  const handleCreditsChange = (e) => {
    setAdminCredits(e.target.value);
  };

  const handleFiltersStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const filteredData =
    selectedStatus === "All"
      ? requests
      : requests.filter((item) => item.status === selectedStatus.toLowerCase());

  const sortByDate = () => {
    const sorted = [...filteredData].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder ? dateA - dateB : dateB - dateA;
    });
    setRequests(sorted); // Update requests state instead of setFilteredData
    setSortOrder((prev) => !prev);
  };

  return (
    <>
      <div className="flex m-8">
        <div className="bg-white border rounded-lg shadow-lg flex h-3/4 items-center p-3 lg:w-2/4 w-full">
          <div className="w-full m-5">
            <div className="bg-blue-50 p-5 rounded-lg mb-4">
              <h3 className="text-blue-500 text-xl font-semibold mb-2">
                Client Name:
              </h3>
              <p className="text-gray-800 text-lg">{clientInfo?.name}</p>
            </div>
            <div className="bg-blue-50 p-5 rounded-lg mb-4">
              <h3 className="text-blue-500 text-xl font-semibold mb-2">
                Mobile:
              </h3>
              <p className="text-gray-800 text-lg">{clientInfo?.mobile}</p>
            </div>
            <div className="bg-blue-50 p-5 rounded-lg mb-4">
              <h3 className="text-blue-500 text-xl font-semibold mb-2">
                Credits:
              </h3>
              <p className="text-gray-800 text-lg">{clientInfo?.credits}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col px-4 w-full">
          <button
            onClick={() => showCreateCustomerModal(true)}
            className="px-6 py-2 mb-4 w-full text-xl font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Create New Customer
          </button>
          <button
            onClick={handleModalPurchaseRequest}
            className="px-6 py-2 w-full text-xl font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Request for Credits
          </button>
          <div className="m-8">
            <h2 className="text-2xl font-semibold mb-4">Requests To Admin</h2>
            <div
              className="overflow-y-auto no-scrollbar border"
              style={{ height: "40vh" }}
            >
              <table className="min-w-full  bg-white border border-gray-200">
                <thead className="bg-gray-200 sticky top-[-1px]">
                  <tr>
                    <th className="py-2 px-4 border-b">Credits</th>
                    <th className="py-2 px-4 border-b">
                      <label>Status : </label>
                      <select
                        className="border px-4 py-1  box-border rounded-md bg-gray-300"
                        onChange={handleFiltersStatusChange}
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
                    <th className="py-2 px-4 border-b">
                      Date
                      <button onClick={sortByDate}>
                        <FontAwesomeIcon
                          className={`rotate-90 mx-1 ${
                            sortOrder ? "transform rotate-180" : ""
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
                      <td
                        className="py-2 px-4 border-b text-center"
                        colSpan="5"
                      >
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

      <CreateCustomerJSX
        showModal={createCustomerModal}
        setShowModal={showCreateCustomerModal}
      />

      {purchaseRequestModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 w-1/3">
            <h3 className="text-2xl mb-4">Request Credits from Admin</h3>
            <form onSubmit={requestCreditsFromAdmin}>
              <div className="mb-4">
                <label className="block mb-2">Credits:</label>
                <input
                  type="number"
                  value={adminCredits}
                  onChange={handleCreditsChange}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                  min={1}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleModalPurchaseRequest}
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
    </>
  );
};

export default ClientDashboard;
