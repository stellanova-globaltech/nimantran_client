import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CreateCustomerJSX from "../components/Other/CreateCustomerModal/CreateCustomerModal";
import debounce from "lodash/debounce"; // Import debounce from lodash
import { Country, State, City } from "country-state-city";
const CreateEvent = () => {
  const navigate = useNavigate();
  const [eventName, setEventName] = useState("");
  const [dateOfOrganising, setDateOfOrganising] = useState("");
  const [location, setLocation] = useState("");
  const [editType, setEditType] = useState("imageEdit");
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [inputFieldActive, setInputFieldActive] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const [filteredCustomerData, setFilteredCustomerData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false);
  const [isInvalidCustomer, setIsInvalidCustomer] = useState(false);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const customerIdFromLocal = localStorage.getItem("_id");
  const [minDate, setMinDate] = useState("");
  const customerSearchParams = localStorage.getItem("customerId");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  useEffect(() => {
    // Load countries when component mounts
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);
    setSelectedState(""); // Reset state and city
    setSelectedCity("");
    setLocation(""); // Reset location
    const allStates = State.getStatesOfCountry(countryCode);
    setStates(allStates);
  };

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    setSelectedState(stateCode);
    setSelectedCity("");
    setLocation(""); // Reset location
    const allCities = City.getCitiesOfState(selectedCountry, stateCode);
    setCities(allCities);
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    // Set the location as a combination of country, state, and city
    if (selectedCountry && selectedState) {
      const countryName = countries.find(
        (country) => country.isoCode === selectedCountry
      )?.name;
      const stateName = states.find(
        (state) => state.isoCode === selectedState
      )?.name;
      setLocation(`${cityName}, ${stateName}, ${countryName}`);
    }
  };
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const eventData = {
        eventName,
        dateOfOrganising,
        location,
        editType,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/events/create-event/${
          role === "customer" ? customerIdFromLocal : selectedCustomerId?.id
        }`,
        eventData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Event created successfully");
      navigate(`/event/${editType}?eventId=${response?.data?.data?._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error creating event");
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/client/clientCustomers`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCustomerData(response?.data?.customerNamesAndId);
      setFilteredCustomerData(response?.data?.customerNamesAndId);
    } catch (error) {
      console.error("Error while fetching Clients Customer Names :", error);
      toast.error("Error while fetching Clients Customer Names");
    }
  };
  useEffect(() => {
    if (!customerSearchParams) {
      fetchData();
    } else {
      setSelectedCustomerId(customerSearchParams);
    }
  }, [token]);

  const handleSearch = useCallback(
    debounce((term) => {
      const filteredData = customerData.filter((customer) =>
        customer.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredCustomerData(filteredData);

      // Real-time validation
      const selectedCustomer = customerData.find(
        (customer) => customer.name.toLowerCase() === term.toLowerCase()
      );
      setIsInvalidCustomer(!selectedCustomer && term !== "");
      toast.dismiss();
      // Show error toast if customer name is invalid
      if (!selectedCustomer && term !== "") {
        // toast.dismiss()
        toast.error("Please select a valid customer from the list");
      }
    }, 1200), // Adjust debounce delay as needed
    [customerData]
  );

  useEffect(() => {
    if (!customerSearchParams) {
      handleSearch(searchTerm);
    }
  }, [searchTerm, handleSearch]);

  const handleCustomerSelection = (customer) => {
    setSelectedCustomerId({ id: customer.id, name: customer.name });
    setInputFieldActive(false);
    setSearchTerm(customer.name);
    setIsInvalidCustomer(false);
  };

  const validateCustomerSelection = () => {
    const selectedCustomer = customerData.find(
      (customer) => customer.name.toLowerCase() === searchTerm.toLowerCase()
    );
    if (!selectedCustomer) {
      setSelectedCustomerId(null);
      setIsInvalidCustomer(true);

      toast.error("Please select a valid customer from the list");
    } else {
      setIsInvalidCustomer(false);
    }
  };
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setMinDate(today);
  }, []);

  return (
    <div className="m-5">
      <h2 className="text-3xl font-semibold mb-6 text-center">Create Event</h2>
      <div className="flex items-center h-full w-full">
        <form
          onSubmit={(e) => {
            validateCustomerSelection();
            if (selectedCustomerId) handleCreateEvent(e);
          }}
          className="mx-auto border bg-white p-6 rounded-lg shadow-lg grid grid-cols-2 gap-x-4 items-start w-full"
        >
          <div className="mb-6">
            <label className="mx-0 text-lg font-medium text-gray-700">
              Event Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="mt-1 mx-0 w-full border rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
              required
            />
          </div>
          {role !== "customer" && (
            <div className="mb-6 relative">
              <label className="flex justify-between text-lg font-medium text-gray-700">
                <span>
                  Customer <span className="text-red-600">*</span>
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 cursor-pointer"
                  onClick={() => setShowCreateCustomerModal(true)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                  />
                </svg>
              </label>
              <input
                type="text"
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={() => setInputFieldActive(true)}
                value={searchTerm}
                className={`mt-1 mx-0 w-full border rounded-md shadow-sm p-2 outline-none  ${
                  isInvalidCustomer
                    ? "focus:outline-red-500"
                    : "focus:outline-blue-500"
                }`}
              />
              {filteredCustomerData?.length > 0 && inputFieldActive && (
                <div className="bg-white w-full absolute z-10 rounded-md shadow-lg px-2 py-1 top-[calc(100%+0.25rem)]">
                  <ul
                    className={`flex gap-y-2 flex-col max-h-28 ${
                      filteredCustomerData?.length > 4 && "overflow-y-scroll"
                    }`}
                  >
                    {filteredCustomerData?.map((customer) => (
                      <li
                        key={customer.id}
                        onClick={() => handleCustomerSelection(customer)}
                        className="bg-gray-100 px-1 py-1 cursor-pointer"
                      >
                        {customer.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          <div className="mb-6">
            <label className="mx-0 text-lg font-medium text-gray-700">
              Date of Organizing
            </label>
            <input
              type="date"
              min={minDate}
              value={dateOfOrganising}
              onChange={(e) => setDateOfOrganising(e.target.value)}
              className="mt-1 mx-0 w-full border rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
            />
          </div>

          <div className="mb-6">
            <label className="mx-0 text-lg font-medium text-gray-700">
              Location
            </label>
            <div className="flex gap-x-2 mt-1">
              <select
                onChange={handleCountryChange}
                value={selectedCountry}
                className="p-2 rounded-md max-w-28"
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </select>

              <select
                onChange={handleStateChange}
                value={selectedState}
                disabled={!selectedCountry}
                className="p-2 rounded-md max-w-28 outline-1 outline-gray-800 bg-gray-200"
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </option>
                ))}
              </select>

              <select
                onChange={handleCityChange}
                value={selectedCity}
                disabled={!selectedState}
                className="p-2 rounded-md max-w-28 outline-1 outline-gray-800 bg-gray-200"
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6 ">
            <label className="mx-0 text-lg font-medium text-gray-700">
              Edit Type <span className="text-red-600">*</span>
            </label>
            <select
              value={editType}
              onChange={(e) => setEditType(e.target.value)}
              className="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
            >
              <option value="imageEdit">Image Edit</option>
              <option value="videoEdit">Video Edit</option>
              <option value="cardEdit">Pdf Edit</option>
            </select>
          </div>

          <div className="flex items-center justify-center w-full mt-6">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md w-full"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
      {showCreateCustomerModal && (
        <CreateCustomerJSX
          showModal={showCreateCustomerModal}
          setShowModal={setShowCreateCustomerModal}
        />
      )}
    </div>
  );
};

export default CreateEvent;
