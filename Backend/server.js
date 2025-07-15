require('dotenv').config();

const express = require("express");
const app = express();
const handleServerError = require("./middleware/handleServerError.js");
require("./config/database.js");
const authRoutes = require("./routes/auth.js");

const bookingRoutes = require("./routes/booking.js");

const cricksalRoutes = require("./routes/cricksal.js")
const AllUserRoutes = require("./routes/AdminPanel.js")

const profilesRoutes = require("./routes/profiles.js")

const reviewRoutes = require("./routes/review.js")

const fileUpload = require("express-fileupload")
const cors = require("cors");
const { startBookingStatusUpdater } = require('./controller/booking.js');
const healthRoutes = require('./routes/health');


app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));
app.use(fileUpload({
  limits: { 
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5000000 // 5MB default
  },
  abortOnLimit: true,
  responseOnLimit: "File size limit exceeded"
}))
app.use(express.static('uploads'))//http://localhost:8000/mm.jpg yo dekhina ko lagi
// public path

// Health check endpoint for Docker
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use(authRoutes);
app.use(cricksalRoutes);
app.use(bookingRoutes)
app.use(AllUserRoutes);
app.use(profilesRoutes);
app.use(reviewRoutes);
app.use('/api', healthRoutes);

startBookingStatusUpdater();

app.use((req, res) => {
  res.status(404).send({ msg: "Resource not found" });
});
app.use(handleServerError);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
