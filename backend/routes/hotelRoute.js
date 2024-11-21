const express = require("express");
const { createHotel, getAllHotels, getOneHotel, getLocation, find_nearest } = require("../controllers/hotelCtrl");
const upload = require("../middlewares/multer");

const hotelRoute = express.Router();


// Create a new hotel with image uploads
hotelRoute.post('/create', upload.array('images', 5), createHotel);  // http://localhost:8000/api/v1/hotels/create

// Endpoint to save location data
hotelRoute.post('/get-location', getLocation);  // http://localhost:8000/api/v1/hotels/get-location

// Retrieve all hotels
hotelRoute.get('/hotels', getAllHotels);  // http://localhost:8000/api/v1/hotels/hotels

// Retrieve one hotel by email
hotelRoute.get('/:email', getOneHotel);  // http://localhost:8000/api/v1/hotels/:email

// Find nearest hotels based on location
hotelRoute.post('/find-nearest', find_nearest);  // http://localhost:8000/api/v1/hotels/find-nearest

module.exports = hotelRoute;
