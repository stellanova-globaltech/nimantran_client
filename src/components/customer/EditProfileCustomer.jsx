import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";

const EditProfileCustomer = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [params] = useSearchParams();
  const customerId = params.get("customerId");

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    gender: "",
    dateOfBirth: "",
    location: "",
  });

  const [loading, setLoading] = useState(true);
  
  const fetchCustomerDetails = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/customers/customerInfo/${customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFormData(data?.data);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerDetails();
  }, [customerId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/customers/updateCustomer/${customerId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Customer details updated successfully");
      navigate(`/customer/profile?customerId=${customerId}`);
    } catch (error) {
      toast.error("Error updating customer details");
    }
  };

  if (loading) {
    return (
      <div className="flex h-full w-full justify-center items-center">
        <div className="spinner"></div> {/* Spinner */}
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center h-full">
      <div className="bg-white border p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-9 text-center">
          Update Customer Details
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { label: "Name", name: "name", type: "text" },
              { label: "Mobile", name: "mobile", type: "tel" },
              { label: "Gender", name: "gender", type: "text" },
              { label: "Date of Birth", name: "dateOfBirth", type: "date" },
              { label: "Location", name: "location", type: "text" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                {console.log(new Date(formData.dateOfBirth).toLocaleDateString())}
                <input
                  type={field.type}
                  name={field.name}
                  value={field.name === 'dateOfBirth' ? 
                    (formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : '') : 
                    formData[field.name]
                  }
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-start">
            <button
              type="submit"
              className="py-2 px-4 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Update
            </button>
          </div>
        </form>
        <Toaster />
      </div>
    </div>
  );
};

export default EditProfileCustomer;
