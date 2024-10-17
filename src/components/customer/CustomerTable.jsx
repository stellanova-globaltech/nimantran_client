import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";

const CustomerTable = () => {
  const token = localStorage.getItem("token");
  const [clientInfo, setClientInfo] = useState({});
  const [customerRequests, setCustomerRequests] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [creditModal, showCreditModal] = useState(false);
  const [credits, setCredits] = useState(0);
  const [tableSwitch, setTableSwitch] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const [sortByDate, setsortByDate] = useState(null); // Sorting state for date
  const [sortByCredits, setsortByCredits] = useState(null); // Sorting state for credits
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [acceptedRequestId, setAcceptedRequestId] = useState("");

  const handleAcceptRequest = async (requestId) => {
    try {
      setShowWarningModal(false);
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/client/acceptCustomerCreditRequest/${requestId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data?.success) {
        toast.success(data.message);
        fetchCustomersRequest(); // Refresh requests after accepting
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setAcceptedRequestId("");
  };

  const handleRejectRequest = async (requestId) => {
    try {
      setShowWarningModal(false);
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/client/rejectCustomerCreditRequest/${requestId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data?.success) {
        toast.success(data.message);
        fetchCustomersRequest(); // Refresh requests after accepting
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setAcceptedRequestId("");
  };

  const fetchClientDetails = async () => {
    setLoading(true); // Start loading
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/client`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setClientInfo(data?.data);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const fetchCustomersRequest = async () => {
    setLoading(true); // Start loading
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/client/my-customer-requests`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCustomerRequests(data?.data);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (tableSwitch) {
      fetchClientDetails();
    } else {
      fetchCustomersRequest();
    }
  }, [tableSwitch]);

  const handleTab = (isCustomerTab) => {
    setTableSwitch(isCustomerTab);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCustomers = (clientInfo?.customers || [])?.filter(
    (customer) =>
      customer?.mobile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRequestsCustomers = customerRequests.filter((customer) => {
    return (
      customer?.By?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.By?.mobile.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortByDateFn = (requests, ascending) => {
    return requests.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return ascending ? dateA - dateB : dateB - dateA;
    });
  };

  const sortByCreditsFn = (requests, ascending) => {
    return requests.sort((a, b) => {
      return ascending ? a.credits - b.credits : b.credits - a.credits;
    });
  };

  const handleSortToggle = (type) => {
    if (type === "date") {
      const newSortByDate = sortByDate === null ? true : !sortByDate;
      setsortByDate(newSortByDate);
      setsortByCredits(null);
    } else if (type === "credits") {
      const newSortByCredits = sortByCredits === null ? true : !sortByCredits;
      setsortByCredits(newSortByCredits);
      setsortByDate(null);
    }
  };

  const sortedRequests =
    sortByCredits !== null
      ? sortByCreditsFn(filteredRequestsCustomers, sortByCredits)
      : sortByDate !== null
      ? sortByDateFn(filteredRequestsCustomers, sortByDate)
      : filteredRequestsCustomers;

  const transferCredits = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/client/transfer-credits`,
        { customerId, credits: parseInt(credits) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(data.message);
      fetchClientDetails();
      handleModalCredits(customerId);
      setCredits(0);
    } catch (error) {
      toast.error(error?.response?.data);
    }
  };
  const handleKeyPress = (event) => {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  };

  const handleModalCredits = (Id) => {
    setCustomerId(Id);
    showCreditModal(!creditModal);
  };
  const handleFiltersStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };
  const filteredData =
    selectedStatus === "All"
      ? sortedRequests
      : sortedRequests.filter(
          (item) => item.status === selectedStatus.toLowerCase()
        );
  const navigate = useNavigate();
  const handleCustomerProfile = (id) => {
    // navigate(`/customer/profile?customerId=${id}`);
  };

  return (
    <div>
      <div className="rounded-lg p-6 flex-3 max-w-full h-[70vh]">
        <div className="flex justify-between mb-6">
          <div className="flex flex-wrap space-x-4">
            <button
              className={`px-6 py-2 text-lg font-semibold rounded-lg ${
                tableSwitch
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => handleTab(true)}
            >
              Customers List
            </button>
            <button
              className={`px-6 py-2 text-lg font-semibold rounded-lg ${
                !tableSwitch
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => handleTab(false)}
            >
              Customers Requests
            </button>
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="px-4 py-2 w-1/3 min-w-40 max-h-10 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="overflow-auto max-h-full font-light">
          {loading ? (
            <div className="flex h-full w-full justify-center items-center">
              <div className="spinner"></div> {/* Spinner */}
            </div>
          ) : tableSwitch ? (
            <table className="w-full table-auto max-h-full border-collapse relative">
              <thead className="bg-gray-200 sticky top-0">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Mobile</th>
                  <th className="px-4 py-2">Credits</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers?.map((customer) => (
                  <tr
                    key={customer._id}
                    className="even:bg-gray-100 odd:bg-white cursor-pointer hover:bg-slate-200"
                  >
                    <td
                      onClick={() => handleCustomerProfile(customer._id)}
                      className="px-4 py-2 text-center"
                    >
                      {customer.name}
                    </td>
                    <td className="px-4 py-2 text-center">{customer.mobile}</td>
                    <td className="px-4 py-2 text-center">
                      {customer.credits}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleModalCredits(customer._id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                      >
                        Transfer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full table-auto h-full border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2">Request By</th>
                  <th className="px-4 py-2">Mobile</th>
                  <th className="px-4 py-2">
                    Date
                    <button
                      className="mx-1"
                      onClick={() => handleSortToggle("date")}
                    >
                      <FontAwesomeIcon
                        icon={faArrowRightArrowLeft}
                        className={`rotate-90 text-sm ${
                          sortByDate ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>
                  </th>
                  <th className="px-4 py-2">
                    Credits
                    <button
                      className="mx-1"
                      onClick={() => handleSortToggle("credits")}
                    >
                      <FontAwesomeIcon
                        icon={faArrowRightArrowLeft}
                        className={`rotate-90 text-sm ${
                          sortByCredits ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>
                  </th>
                  <th className="px-4 py-2">
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
                        Rejected
                      </option>
                    </select>
                  </th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData?.map((request) => (
                  <tr
                    key={request._id}
                    className="even:bg-gray-100 odd:bg-white"
                  >
                    <td className="px-4 py-2 text-center">
                      {request?.By?.name}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {request?.By?.mobile}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-center">{request.credits}</td>
                    <td
                      className={`px-4 py-2 text-center ${
                        request.status === "pending"
                          ? "text-yellow-600"
                          : request.status === "completed"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {request.status}
                    </td>
                    <td className="px-4 py-2 text-center">
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
          )}
        </div>
      </div>
      {creditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Transfer Credits</h2>
            <form onSubmit={transferCredits}>
              <div className="mb-4">
                <label
                  htmlFor="credits"
                  className="block text-sm font-medium text-gray-700"
                >
                  Credits
                </label>
                <input
                  type="number"
                  id="credits"
                  value={credits}
                  onChange={(e) => setCredits(e.target.value)}
                  onKeyPress={handleKeyPress}
                  min={0}
                  className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    showCreditModal(false);
                    setCredits(0);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  Transfer
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
    </div>
  );
};

export default CustomerTable;
