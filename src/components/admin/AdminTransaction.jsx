import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";

const AdminTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const [sortByDate, setsortByDate] = useState(null);
  const [sortByCredits, setsortByCredits] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/transictions/get-admin-transaction`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTransactions(response.data.data.reverse());
      } catch (err) {
        setError("Error fetching transactions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const sortByDateFn = (requests, ascending) => {
    return requests.sort((a, b) => {
      const dateA = new Date(a.transactionDate);
      const dateB = new Date(b.transactionDate);
      return ascending ? dateA - dateB : dateB - dateA;
    });
  };

  const sortByCreditsFn = (requests, ascending) => {
    return requests.sort((a, b) => {
      return ascending ? a.amount - b.amount : b.amount - a.amount;
    });
  };

  const handleSortToggle = (type) => {
    if (type === "date") {
      const newSortByDate = sortByDate === null ? true : !sortByDate;
      setsortByDate(newSortByDate);
      setsortByCredits(null);
      setTransactions(sortByDateFn([...transactions], newSortByDate));
    } else if (type === "credits") {
      const newSortByCredits = sortByCredits === null ? true : !sortByCredits;
      setsortByCredits(newSortByCredits);
      setsortByDate(null);
      setTransactions(sortByCreditsFn([...transactions], newSortByCredits));
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

  if (error) {
    return <div>{error}</div>;
  }
  const filteredTransactions = transactions.filter((transaction) => {
    return transaction.recieverId.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  return (
    <div className="w-full flex flex-col overflow-scroll no-scrollbar h-full">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Transaction Id
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date
              <button className="mx-1" onClick={() => handleSortToggle("date")}>
                <FontAwesomeIcon
                  icon={faArrowRightArrowLeft}
                  className={`rotate-90 text-sm ${
                    sortByDate ? "transform rotate-180" : ""
                  }`}
                />
              </button>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center"
            >
              Statement
              <div
                className="relative flex  items-center
              "
              >
                <input
                  type="text"
                  className="ml-2 rounded-lg px-2 py-1"
                  placeholder="search receiver name"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* <div className=" absolute  right-2 z-10">
                  <FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon>
                </div> */}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
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
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredTransactions.map((transaction) => (
            <tr
              key={transaction._id}
              className="hover:bg-gray-100 cursor-pointer"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {transaction._id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(transaction.transactionDate).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                transfer to {transaction.recieverId.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-red-900">
                {transaction.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTransaction;
