import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const Transactions = () => {
  const token = localStorage.getItem("token");
  const [params] = useSearchParams();
  const customerId = params.get("customerId");
  const [transactions, setTransactions] = useState([]);
  const [credits, setcredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/transictions/get-transictions?customerId=${customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTransactions(response.data.transactions);
      setcredits(response.data.credits.credits);
    } catch (err) {
      setError(
        err.response
          ? err.response.data.message
          : "Server error. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [token]);

  const filteredTransactions = transactions.filter((transaction) => {
    return (
      transaction?.recieverId?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction?.eventId?.eventName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  if (loading)
    return (
      <div className="flex h-full w-full justify-center items-center">
        <div className="spinner"></div>
      </div>
    );
  if (error) return <div className="w-full h-full flex justify-center items-center text-xl font-bold">Error: {error}</div>;

  return (
    <div className="w-full flex flex-col overflow-hidden no-scrollbar h-full mx-auto">
      <div className="w-full flex  items-center justify-between px-2">
        <h2 className="text-2xl p-3 font-bold ">Customer Transactions</h2>

        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="px-4 py-2 w-1/3 min-w-40 max-h-10 border border-gray-300 rounded-lg"
        />
      </div>
      {transactions.length === 0 ? (
        <div>No Transactions yet </div>
      ) : (
        <div className="overflow-x-auto h-full">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200 sticky top-0">
              <tr>
                <th className="text-left p-4">Transaction Id</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Statement</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction?._id} className="hover:bg-gray-100">
                  <td className="p-4">{transaction?._id}</td>
                  <td className="p-4">
                    {new Date(
                      transaction?.transactionDate
                    ).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    {transaction?.areaOfUse === "transfer"
                      ? `Received by ${transaction?.recieverId?.name}`
                      : `Spend on ${transaction?.eventId?.eventName}`}
                  </td>
                  <td className="p-4">{transaction?.status}</td>
                  <td
                    className={`p-4 ${
                      transaction.areaOfUse === "transfer"
                        ? "text-green-500 before:content-['+']"
                        : "text-red-500 before:content-['-']"
                    }`}
                  >
                    {transaction?.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="w-full p-2 justify-end flex bg-gray-200 sticky bottom-0">
            Current Balance:
            <span className=" font-bold text-green-500 pr-14 pl-1 ">
              {credits}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
