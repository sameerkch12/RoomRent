import React, { useState } from "react";
import axios from "axios";

const HotelRegister = () => {
  const [hotel, setHotel] = useState({
    name: "",
    phone: "",
    address: "",
    price: "",
    room: "",
    wifi: "No",
    furnished: "No",
    latitude: null,
    longitude: null,
  });
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Added loading state

  const validateForm = () => {
    const newErrors = {};
    if (!hotel.name) newErrors.name = "Name is required";
    if (!hotel.phone) newErrors.phone = "Phone is required";
    if (!hotel.address) newErrors.address = "Address is required";
    if (!hotel.price) newErrors.price = "Price is required";
    if (images.length === 0) newErrors.images = "At least one image is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHotel((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setHotel((prev) => ({ ...prev, latitude, longitude }));
          alert("Location retrieved successfully!");
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setLoading(true); // Set loading state

    try {
      const formData = new FormData();
      Object.keys(hotel).forEach((key) => formData.append(key, hotel[key]));
      images.forEach((image) => formData.append("images", image));

      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/hotels/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Hotel Added:", response.data);
      alert(`Hotel "${hotel.name}" added successfully!`);
      setHotel({
        name: "",
        phone: "",
        address: "",
        price: "",
        room: "",
        wifi: "No",
        furnished: "No",
        latitude: null,
        longitude: null,
      });
      setImages([]);
      setErrors({});
    } catch (error) {
      console.error("Error adding hotel:", error);
      alert(`Error adding hotel: ${error.response?.data?.msg || error.message}`);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Add New Hotel</h2>
      {loading && <p>Loading...</p>} {/* Display loading state */}

      <button onClick={getLocation} type="button" className="w-full bg-green-500 text-white p-2 rounded-md mb-4">
        Use My Location
      </button>

      <div className="mb-4">
        <input
          type="text"
          name="name"
          placeholder="Enter Title"
          value={hotel.name}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />
        {errors.name && <p className="text-red-500">{errors.name}</p>}
      </div>

      <div className="mb-4">
        <input
          type="text"
          name="phone"
          placeholder="Enter Contact Number"
          value={hotel.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />
        {errors.phone && <p className="text-red-500">{errors.phone}</p>}
      </div>

      <div className="mb-4">
        <textarea
          name="address"
          placeholder="Enter Address"
          value={hotel.address}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        ></textarea>
        {errors.address && <p className="text-red-500">{errors.address}</p>}
      </div>

      <div className="mb-4">
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={hotel.price}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />
        {errors.price && <p className="text-red-500">{errors.price}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Room Type</label>
        <select
          name="room"
          value={hotel.room}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        >
          <option value="Select Room Type">Select</option>
          <option value="Single Room">Single Room</option>
          <option value="1BHK">1BHK</option>
          <option value="2BHK">2BHK</option>
        </select>
        {errors.room && <p className="text-red-500">{errors.room}</p>}
      </div>

      <div className="flex items-center mb-4">
        <label className="px-3 block text-gray-700">Wifi</label>
        <select
          name="wifi"
          value={hotel.wifi}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
        <label className="px-3 block text-gray-700">Furnished</label>
        <select
          name="furnished"
          value={hotel.furnished}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Images</label>
        <input
          type="file"
          name="images"
          multiple
          onChange={handleFileChange}
          className="w-full p-2 border rounded-md"
        />
        {errors.images && <p className="text-red-500">{errors.images}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
      >
        Create Hotel
      </button>
    </form>
  );
};

export default HotelRegister;
