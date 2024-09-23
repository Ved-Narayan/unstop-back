const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const seatRoutes = require('./routes/seatRoutes');
const { mongoURI } = require('./config');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  // Prepopulate database with seats
  const Seat = require('./models/Seat');
  Seat.countDocuments().then((count) => {
    if (count === 0) {
      const seats = Array.from({ length: 80 }, (_, i) => ({
        seatNumber: i + 1,
        isBooked: Math.random() < 0.3, // Randomly book 30% of the seats
      }));
      Seat.insertMany(seats).then(() => console.log('Seats populated'));
    }
  });
}).catch((error) => console.log(error));

// Routes
app.use('/api', seatRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
