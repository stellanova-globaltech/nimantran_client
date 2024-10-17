import axios from "axios";
import React, { useEffect, useState } from "react";
import EditEventModal from "../events/EditEventModal";
import { useNavigate, useSearchParams } from "react-router-dom";

const CustomerEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchItem, setsearchItem] = useState("");
  const token = localStorage.getItem("token");
  const [params] = useSearchParams();
  const id = params.get("customerId");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/customers/customerEvents/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEvents(response.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [id, token]);

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedEvent(null);
  };

  // const handleDeleteEvent = async (event) => {
  //   try {
  //     await axios.delete(
  //       `${process.env.REACT_APP_BACKEND_URL}/events/delete-event/${event._id}/${customer._id}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     setEvents(events.filter((e) => e._id !== event._id));
  //     toast.success("Event deleted successfully");
  //   } catch (error) {
  //     console.error("Error deleting event:", error);
  //     toast.error("Error deleting event");
  //   }
  // };

  const handleEventUpdated = () => {
    fetchEvents();
  };

  const handleEditClick = (customerId, event) => {
    setSelectedEvent(event);
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="flex h-full w-full justify-center items-center">
        <div className="spinner"></div> {/* Spinner */}
      </div>
    );
  }
  const filteredEvents = events.filter((event) =>
    event?.eventName?.toLowerCase().includes(searchItem?.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col overflow-scroll no-scrollbar h-full">
      {events.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-x-2"
              >
                Event Name
                <input
                  type="text"
                  className="px-2 py-1 rounded-full border-[1px] border-gray-400"
                  placeholder="Search here"
                  onChange={(e) => setsearchItem(e.target?.value?.trim())}
                />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Media Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date of Organizing
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
                Processing
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Edit
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEvents.map((event) => (
              <tr key={event._id} className="hover:bg-gray-100">
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer"
                  onClick={() =>
                    navigate(`/event/${event.editType}?eventId=${event._id}`)
                  }
                >
                  {event.eventName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {event.editType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {console.log(event.dateOfOrganising)}
                  {event.dateOfOrganising
                    ? new Date(event.dateOfOrganising).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {event.location ? event.location : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {event.processingStatus}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 cursor-pointer text-gray-500 hover:text-blue-500 transition duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(event.customerId, event);
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <h1 className="text-4xl">No events Yet!</h1>
        </div>
      )}
      <EditEventModal
        show={showEditModal}
        onClose={handleCloseEditModal}
        event={selectedEvent}
        customerId={id}
        onEventUpdated={handleEventUpdated}
      />
    </div>
  );
};

export default CustomerEvents;
