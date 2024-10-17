import React, { useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const EditEventModal = ({
  customerId,
  show,
  onClose,
  event,
  onEventUpdated,
}) => {
  const eventNameRef = useRef(event?.eventName || "");
  const role = localStorage.getItem("role");
  const dateOfOrganisingRef = useRef(
    event ? new Date(event.dateOfOrganising).toISOString().split("T")[0] : ""
  );
  const locationRef = useRef(event?.location || "");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      eventName: eventNameRef.current.value,
      dateOfOrganising: dateOfOrganisingRef.current.value,
      location: locationRef.current.value,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/events/update-event/${event._id}/${customerId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(response.data.message);
      onEventUpdated(); // Notify parent component about the update
      onClose(); // Close the modal
    } catch (error) {
      toast.error("Error updating event");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black bg-opacity-50 absolute inset-0"></div>
      <div className="bg-white p-6 rounded-lg relative z-10 w-1/2">
        <h2 className="text-xl font-semibold mb-4">Edit Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Event Name</label>
            <input
              type="text"
              name="eventName"
              defaultValue={event?.eventName || ""}
              ref={eventNameRef}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              name="dateOfOrganising"
              defaultValue={
                event
                  ? new Date(event.dateOfOrganising).toISOString().split("T")[0]
                  : ""
              }
              ref={dateOfOrganisingRef}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              defaultValue={event?.location || ""}
              ref={locationRef}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() =>
                navigate(`/event/${event.editType}?eventId=${event._id}`)
              }
              className="px-4 py-2 bg-red-500 text-white rounded-lg mr-2"
            >
              Edit Media
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-500 text-white rounded-lg mr-2"
            >
              Cancel
            </button>
            {(role === "client" || role === "admin") && (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Save
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;
