import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("customer"); // 'customer' or 'client'
  const [creditModal, setCreditModal] = useState(false);
  const [creditsToTransfer, setCreditsToTransfer] = useState(0);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [searchItem, setsearchItem] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/admin/getAllUsers`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching users");
      setLoading(false);
    }
  };

  // const handleCustomerProfile = (id) => {
  //   if (activeTab === "customer") {
  //     localStorage.setItem("customerId", id);
  //     navigate(`/customer/profile?customerId=${id}`);
  //   }
  // };
  // const handleClientProfile = (id) => {
  //   if (activeTab === "client") {
  //     localStorage.setItem("clientId", id);
  //     navigate(`/client/profile?clientId=${id}`);
  //   }
  // };
  const handleProfile = (id, role) => {
    if (activeTab === "customer") {
      localStorage.setItem("customerId", id);
      navigate(`/customer/profile?customerId=${id}`);
    } else {
      // localStorage.setItem("clientId", id);
      // navigate(`/client/dashboard?clientId=${id}`);
    }
  };

  const transferCreditsToClient = async (e, customerId) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/admin/transfer-credits-to-client`,
        { userId: selectedCustomerId, credits: parseInt(creditsToTransfer) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCreditsToTransfer(0);
      setSelectedCustomerId("");
      setCreditModal(false);
      fetchUsers();
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => user.role === activeTab);
  const filterData = filteredUsers.filter((item) => {
    return item.name.toLowerCase().includes(searchItem.toLowerCase());
  });
  const handleKeyPress = (event) => {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  };
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div>
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-500"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-auto p-4">
      <div className="flex flex-wrap space-x-4 mb-4 ">
        <button
          className={`px-6 py-2 text-lg font-semibold rounded-lg ${
            activeTab === "customer"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("customer")}
        >
          Customers
        </button>
        <button
          className={`px-6 py-2 text-lg font-semibold rounded-lg ${
            activeTab === "client"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("client")}
        >
          Clients
        </button>
        <div className=" flex  justify-end flex-1 items-center">
          <div>
            <input
              type="text"
              className="bg-gray-100 px-4 py-1 rounded-full border-gray-300 border-2 "
              placeholder="Search"
              onChange={(event) => setsearchItem(event.target.value)}
            />
          </div>
        </div>
      </div>

      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">
              Name
            </th>
            <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">
              Mobile
            </th>
            {activeTab === "customer" && (
              <>
                <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">
                  Client Name
                </th>
                <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">
                  Date of Birth
                </th>
                <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">
                  Location
                </th>
                <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">
                  Gender
                </th>
              </>
            )}
            <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">
              Credits
            </th>
            {activeTab === "client" && (
              <th className="py-2 px-4 text-center border-b border-gray-200 bg-gray-100">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {filterData.map((user) => (
            <tr
              key={user._id}
              onClick={() => handleProfile(user._id, user.role)}
              className="cursor-pointer"
            >
              <td className="py-2 px-4 border-b text-center border-gray-200">
                {user.name}
              </td>
              <td className="py-2 px-4 border-b text-center border-gray-200">
                {user.mobile}
              </td>
              {activeTab === "customer" && (
                <>
                  <td className="py-2 px-4 border-b text-center border-gray-200">
                    {user.clientId.name}
                  </td>
                  <td className="py-2 px-4 border-b text-center border-gray-200">
                    {user.dateOfBirth
                      ? new Date(user.dateOfBirth).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-2 px-4 border-b text-center border-gray-200">
                    {user.location}
                  </td>
                  <td className="py-2 px-4 border-b text-center border-gray-200">
                    {user.gender}
                  </td>
                </>
              )}
              <td className="py-2 px-4 border-b text-center border-gray-200">
                {user.credits}
              </td>
              {activeTab === "client" && (
                <td className="py-2 px-4 border-b text-center border-gray-200">
                  <button
                    className="px-6 py-2 text-lg font-semibold rounded-lg bg-blue-500 text-white"
                    onClick={() => {
                      setCreditModal(true);
                      setSelectedCustomerId(user._id);
                    }}
                  >
                    Transfer
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {creditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Transfer Credits</h2>
            <form
              onSubmit={(e) => transferCreditsToClient(e, selectedCustomerId)}
            >
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
                  min={0}
                  value={creditsToTransfer}
                  onChange={(e) => setCreditsToTransfer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setCreditModal(false);
                    setSelectedCustomerId("");
                    setCreditsToTransfer(0);
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
    </div>
  );
};

export default UsersTable;
