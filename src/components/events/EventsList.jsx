import React, { useEffect, useState } from "react";
import axios from "axios";
import EditEventModal from "./EditEventModal";
import { useNavigate } from "react-router-dom";

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [customerId, setCustomerId] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [searchItem, setSearchItem] = useState("");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/events/clientEvents`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEvents(response.data.data.events);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEditClick = (customerId, event) => {
    setSelectedEvent(event);
    setCustomerId(customerId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const handleEventUpdated = () => {
    fetchEvents();
  };

  const filteredEvents = events.filter((event) =>
    event.eventName.toLowerCase().includes(searchItem.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col overflow-scroll no-scrollbar h-full">
      {loading ? (
        <div className="flex h-full w-full justify-center items-center">
          <div className="spinner"></div>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-x-2"
              >
                Event Name
                <div>
                  <input
                    type="text"
                    className="px-2 py-1 rounded-full border-[1px] border-gray-400"
                    placeholder="Search here"
                    onChange={(e) => setSearchItem(e.target.value)}
                  />
                </div>
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
                Date of Organising
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
                Customer
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
                  onClick={() => {
                    event.processingStatus === 'completed'
                      ? navigate(`/event/mediaGrid?eventId=${event._id}`)
                      : navigate(
                          `/event/${event.editType}?eventId=${event._id}`
                        );
                  }}
                >
                  {event.eventName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {event.editType === "imageEdit" && "Image"}
                  {event.editType === "videoEdit" && "Video"}
                  {event.editType === "cardEdit" && "PDF"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {!event?.dateOfOrganising
                    ? "-"
                    : new Date(event?.dateOfOrganising).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {event.location || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {event.customerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {event.processingStatus || "-"}
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
      )}
      <EditEventModal
        show={showModal}
        onClose={handleCloseModal}
        event={selectedEvent}
        customerId={customerId}
        onEventUpdated={handleEventUpdated}
      />
    </div>
  );
};

export default EventsList;
