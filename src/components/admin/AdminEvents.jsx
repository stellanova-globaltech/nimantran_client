import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import EditEventModal from "../events/EditEventModal";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [customerId, setCustomerId] = useState(null);
  const [singleEventView, setSingleEventView] = useState(null);
  const [searchItem, setsearchItem] = useState("");

  const token = localStorage.getItem("token");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/events/get-all-events`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEvents(response?.data?.data.reverse());
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEditClick = (event) => {
    setSelectedEvent(event);
    setCustomerId(event?.user?._id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = async (event) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/events/delete-event/${event._id}/${event.user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEvents(events.filter((e) => e._id !== event._id));
      toast.success("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Error deleting event");
    }
  };

  const handleRowClick = (event) => {
    setSingleEventView(event);
  };

  const handleBackClick = () => {
    setSingleEventView(null);
  };

  const handleEventUpdated = () => {
    fetchEvents();
  };

  const filterEventData = events.filter((item) => {
    return item.eventName.toLowerCase().includes(searchItem.toLowerCase());
  });
  // if (singleEventView) {
  //   return (
  //     <div className="w-full flex flex-col items-center p-4">
  //       <div className="bg-white rounded-lg shadow-lg flex flex-col md:flex-row p-6 w-[90%] md:w-[60%] lg:w-[45%] m-6 border border-gray-200 relative">
  //         <button
  //           onClick={handleBackClick}
  //           className="absolute top-4 left-4 bg-transparent text-blue-500 flex items-center p-2 rounded hover:text-blue-700 transition duration-300"
  //         >
  //           <svg
  //             fill="none"
  //             viewBox="0 0 24 24"
  //             strokeWidth={2}
  //             stroke="currentColor"
  //             className="w-6 h-6 mr-2"
  //           >
  //             <path
  //               strokeLinecap="round"
  //               strokeLinejoin="round"
  //               d="M15 19l-7-7 7-7"
  //             />
  //           </svg>
  //           Back
  //         </button>
  //         <div className="flex flex-col justify-between w-full md:w-1/2 p-8">
  //           <div className="bg-gray-50 p-4 rounded-lg mb-4">
  //             <h3 className="text-blue-600 text-lg font-semibold mb-2">
  //               Event Name:
  //             </h3>
  //             <p className="text-gray-800 text-md">
  //               {singleEventView.eventName}
  //             </p>
  //           </div>
  //           <div className="bg-gray-50 p-4 rounded-lg mb-4">
  //             <h3 className="text-blue-600 text-lg font-semibold mb-2">
  //               Date:
  //             </h3>
  //             <p className="text-gray-800 text-md">
  //               {singleEventView.dateOfOrganising
  //                 ? new Date(
  //                     singleEventView.dateOfOrganising
  //                   ).toLocaleDateString()
  //                 : "-"}
  //             </p>
  //           </div>
  //         </div>
  //         <div className="flex flex-col justify-between w-full md:w-1/2 p-8">
  //           <div className="bg-gray-50 p-4 rounded-lg mb-4">
  //             <h3 className="text-blue-600 text-lg font-semibold mb-2">
  //               Location:
  //             </h3>
  //             <p className="text-gray-800 text-md">
  //               {singleEventView.location ? singleEventView.location : "-"}
  //             </p>
  //           </div>
  //           <div className="bg-gray-50 p-4 rounded-lg mb-4">
  //             <h3 className="text-blue-600 text-lg font-semibold mb-2">
  //               Username
  //             </h3>
  //             <p className="text-gray-800 text-md">
  //               {singleEventView.user.name}
  //             </p>
  //           </div>
  //         </div>
  //         <div className="absolute top-4 right-4 flex gap-4">
  //           <svg
  //             fill="none"
  //             viewBox="0 0 24 24"
  //             strokeWidth={1.5}
  //             stroke="currentColor"
  //             className="w-6 h-6 cursor-pointer text-gray-500 hover:text-blue-500 transition duration-300"
  //             onClick={() => handleEditClick(singleEventView)}
  //           >
  //             <path
  //               strokeLinecap="round"
  //               strokeLinejoin="round"
  //               d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
  //             />
  //           </svg>
  //           <svg
  //             fill="none"
  //             viewBox="0 0 24 24"
  //             strokeWidth={1.5}
  //             stroke="currentColor"
  //             className="w-6 h-6 cursor-pointer text-gray-500 hover:text-red-500 transition duration-300"
  //             onClick={() => handleDeleteEvent(singleEventView)}
  //           >
  //             <path
  //               strokeLinecap="round"
  //               strokeLinejoin="round"
  //               d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
  //             />
  //           </svg>
  //         </div>
  //       </div>
  //       <EditEventModal
  //         show={showModal}
  //         onClose={handleCloseModal}
  //         event={selectedEvent}
  //         customerId={customerId}
  //         onEventUpdated={handleEventUpdated}
  //       />
  //     </div>
  //   );
  // }

  return (
    <div className="w-full flex flex-col overflow-scroll no-scrollbar h-full">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center"
            >
              Event Name
              <input
                type="text"
                className="bg-gray-100 px-4 py-1 rounded-full border-gray-300 border-2 ml-4"
                placeholder="Search"
                onChange={(event) => setsearchItem(event.target.value)}
              />
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              MEDIA TYPE
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Location
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Client
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Customer
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              PROCESSING
            </th>
            {/* <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Edit
            </th> */}
            {/* <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Delete
            </th> */}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filterEventData?.map((event) => (
            <tr
              key={event._id}
              className="hover:bg-gray-100 cursor-pointer"
              onClick={() => handleRowClick(event)}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {event.eventName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {event.editType}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {event.dateOfOrganising
                  ? new Date(event.dateOfOrganising).toLocaleDateString()
                  : "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {event.location.length > 0 ? event.location : "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {event.user.clientName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {event.user.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {event.processingStatus ? event.processingStatus : "-"}
              </td>
              {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 cursor-pointer text-gray-500 hover:text-blue-500 transition duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(event);
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </td> */}
              {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 cursor-pointer text-gray-500 hover:text-red-500 transition duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteEvent(event);
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
      {/* <EditEventModal
        show={showModal}
        onClose={handleCloseModal}
        event={selectedEvent}
        customerId={customerId}
        onEventUpdated={handleEventUpdated}
      /> */}
    </div>
  );
};

export default AdminEvents;
