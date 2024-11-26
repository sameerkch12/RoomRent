import React, { useState, } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdOutlineMyLocation } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

const districts = [
  "Raipur",
  "Bilaspur",
  "Durg",
  "Korba",
  "Jagdalpur",
  "Rajnandgaon",
  "Ambikapur",
  "Raigarh",
  "Kanker",
  "Kawardha",
  "Mahasamund",
  "Dhamtari",
  // Add other districts as needed
];

const Navbar = () => {
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [language, setLanguage] = useState("EN");
  const navigate = useNavigate()

  const handleLogin = () =>{
    navigate("/login")
  }

  /*const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };*/
  
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Send the data to the backend
          fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/hotels/get-location`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ latitude, longitude }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Location sent successfully:", data);
            })
            .catch((error) => {
              console.error("Error sending location:", error);
            });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    // <div className="bg-blue-500 h-14">
      <nav className="flex items-center justify-between px-4 py-3 bg-[#ff3b30] text-white shadow-md">
        {/* Logo */}
        <div className="mr-3 text-lg font-bold">Logiao.com</div>

        {/* Location Search */}
        <div className="flex items-center space-x-2">
          <select
            className="bg-gray-700 text-white px-2 py-1 rounded outline-none"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
          >
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
          <button
            className=" flex px-2 py-1 items-center bg-blue-600 rounded hover:bg-blue-500"
            onClick={getLocation}
          >
            <MdOutlineMyLocation/>
            Use Current Location
          </button>
        </div>

        {/* Another Search Bar */}
        <div className="flex-1 mx-4">
          <input
            type="text"
            placeholder="Search... Ex. 1bhk room for rent"
            className="w-full px-2 py-1 bg-white text-black rounded focus:outline-none"
          />
        </div>

        {/* Language Selector */}
        <select
          className="bg-gray-700 mx-5 text-white px-2 py-1 rounded outline-none"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="EN">English</option>
          <option value="HI">हिन्दी</option>
          {/* Add more languages if needed */}
        </select>

        {/* add your room for rent */}
        <div className="mr-3">
            <Link to="/register"  className="p-1 flex justify-center items-center px-2 py-1 bg-blue-600 rounded hover:bg-blue-500"><IoMdAddCircleOutline className="mr-1 text-3xl" /> Add</Link>
        </div>

        {/* Profile and Login */}
        <div className="flex items-center space-x-4">
          <button className="hover:underline" onClick={handleLogin}>Login</button>
          <div className="bg-gray-600 w-8 h-8 rounded-full flex items-center justify-center">
            <span className="text-sm">P</span>
          </div>
        </div>
      </nav>
    // </div>
  );
};

export default Navbar;
