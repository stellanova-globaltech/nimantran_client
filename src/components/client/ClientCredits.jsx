import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightArrowLeft,
  faFolderClosed,
} from "@fortawesome/free-solid-svg-icons";

const Transactions = () => {
  const token = localStorage.getItem("token");
  const [transactions, setTransactions] = useState([]);
  const [credits, setcredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortByDate, setSortByDate] = useState(false);
  const [sortByCredits, setSortByCredits] = useState(false);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortToggle = (sortType) => {
    if (sortType === "date") {
      setTransactions((prevTransactions) => [...prevTransactions].reverse());
      setSortByDate(!sortByDate);
      setSortByCredits(false);
    } else if (sortType === "credits") {
      setSortByCredits(!sortByCredits);
      setSortByDate(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/transictions/get-client-transaction/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTransactions(response.data.transaction);
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

  // Combine transactions, calculate balance, and standardize data
  const formattedTransactions = transactions.map((transaction) => {
    let statement, amount, type;

    if (transaction.areaOfUse === "transfer") {
      statement = `${
        transaction.senderId.role === "admin" ? "Transfer to" : "Received by"
      }  ${transaction?.recieverId?.name}`;
      // Handle potential missing receiver name gracefully
      statement = statement || "Transfer Received";
      amount = parseFloat(transaction.amount); // Ensure numeric amount
      type = transaction.type; // Explicitly show transfer as credit
    } else {
      statement = `Spent on ${
        transaction?.eventId?.eventName !== undefined
          ? transaction?.eventId?.eventName
          : "no event name"
      } [${transaction?.areaOfUse}]`;
      amount = parseFloat(transaction.amount); // Negate amount for spending
      type = transaction.type;
    }

    return {
      _id: transaction._id, // Maintain unique identifier
      date: new Date(transaction?.transactionDate).toLocaleDateString(),
      statement,
      amount,
      status: transaction?.status,
      type,
    };
  });

  // Sort transactions
  const sortedTransactions = sortByCredits
    ? [...formattedTransactions].sort((a, b) => b.amount - a.amount)
    : formattedTransactions;

  const filteredTransactions = sortedTransactions.filter(
    (transaction) =>
      transaction.statement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-full w-full justify-center items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full flex flex-col no-scrollbar h-full mx-auto">
      <div className="w-full flex items-center justify-between px-3 py-2">
        <h2 className="text-2xl font-bold mb-3">Customer Transactions</h2>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="px-4 py-2 w-1/3 min-w-40 max-h-10 border border-gray-300 rounded-lg"
        />
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center flex-col">
          <div className="">
            <FontAwesomeIcon
              className="size-36"
              icon={faFolderClosed}
            ></FontAwesomeIcon>
          </div>
          <div className="text-3xl font-bold"> No Transactions yet</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200 sticky top-0">
              <tr>
                <th className="text-left p-4">Transaction Id</th>
                <th className="text-left p-4">
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
                <th className="text-left p-4">Statement</th>

                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">
                  Amount
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
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="p-4">{transaction._id}</td>
                  <td className="p-4">{transaction.date}</td>
                  <td className="p-4">{transaction.statement}</td>

                  <td className="p-4">{transaction.status}</td>
                  <td
                    className={`p-4 ${
                      transaction.type === "debit"
                        ? "text-red-500 before:content-['-']"
                        : "text-green-500 before:content-['+']"
                    }`}
                  >
                    {transaction.amount}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot></tfoot>
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
