const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const Hotels = require("../models/hotelImage");


const createHotel = async (req, res) => {
  try {
    const {
      name,
      phone,
      price,
      room,
      address,
      wifi,
      furnished,
      latitude,
      longitude,
    } = req.body;
    const images = req.files;

    // Validate required fields
    if (!name || !phone || !address) {
      return res.status(400).json({ msg: "Name, phone, and address are required" });
    }

    // Upload images to Cloudinary if any
    const uploadedImages = images ? await Promise.all(
      images.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path);
        fs.unlink(file.path, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
        return { 
          public_id: result.public_id, 
          url: result.secure_url,  // Use secure_url here
          secure_url: result.secure_url // Add secure_url field
        };
      })
    ) : [];

    // Create hotel data
    const hotelData = {
      name,
      phone,
      address,
      price,
      room,
      wifi,
      furnished,
      images: uploadedImages,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
    };

    const newHotel = new Hotels(hotelData);
    await newHotel.save();

    res.status(201).json({ msg: "Hotel created successfully", success: true, newHotel });
  } catch (error) {
    console.error("Error creating hotel:", error.message);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};



const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotels.find();
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving hotels', error });
  }
};

// Retrieve a single hotel by phone number (assuming it's unique)
const getOneHotel = async (req, res) => {
  const { phone } = req.params;
  try {
    const hotel = await Hotels.findOne({ phone });
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving hotel", error });
  }
};

const getLocation = async (req, res) => {
  const { latitude, longitude } = req.body;

  if (latitude == null || longitude == null) {
    return res.status(400).json({ message: 'Latitude and longitude are required.' });
  }

  try {
    const newLocation = new Hotels({
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
    });
    await newLocation.save();

    res.json({ message: 'Location saved successfully', data: newLocation });
  } catch (error) {
    console.error('Error saving location:', error);
    res.status(500).json({ message: 'Error saving location', error });
  }
};

// Find nearest rent rooms within a specified distance
const find_nearest = async (req, res) => {
  const { latitude, longitude, maxDistance = 1000 } = req.body;

  try {
    const rentRooms = await Hotels.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          distanceField: "dist.calculated",
          maxDistance: parseFloat(maxDistance) * 1609,  // convert miles to meters if needed
          spherical: true,
        },
      },
    ]);

    res.status(200).send({
      success: true,
      msg: "Nearby hotels found",
      data: rentRooms,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      msg: error.message,
    });
  }
};

module.exports = {
  createHotel,
  getAllHotels,
  getOneHotel,
  getLocation,
  find_nearest,
};
