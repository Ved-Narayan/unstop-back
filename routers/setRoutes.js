const express = require('express');
const Seat = require('../models/Seat');
const router = express.Router();

// Fetch all seats
router.get('/seats', async (req, res) => {
  try {
    const seats = await Seat.find({});
    res.json(seats);
  } catch (error) {
    res.status(500).send('Error fetching seats');
  }
});

// Book seats
router.post('/bookSeats', async (req, res) => {
  const { seatNumbers } = req.body;
  try {
    const bookedSeats = await Seat.updateMany(
      { seatNumber: { $in: seatNumbers }, isBooked: false },
      { $set: { isBooked: true } }
    );

    if (bookedSeats.nModified === 0) {
      return res.status(400).send('Some seats are already booked');
    }

    res.status(200).send(`Successfully booked seats: ${seatNumbers.join(', ')}`);
  } catch (error) {
    res.status(500).send('Error booking seats');
  }
});

module.exports = router;
