
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


app.use(express.json());
app.use(cors({
  origin: [
    "http://3.94.196.83:5173",
    "http://3.94.196.83:3000",
    "http://3.94.196.83",
  ],
  credentials: true
}));
app.use(fileUpload({
  limits: { 
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5000000 // 5MB default
  },
  abortOnLimit: true,
  responseOnLimit: "File size limit exceeded"
}))
app.use(express.static('uploads'))//http://3.94.196.83:8000/mm.jpg yo dekhina ko lagi
// public path

app.use(authRoutes);
app.use(cricksalRoutes);
app.use(bookingRoutes)
app.use(AllUserRoutes);
app.use(profilesRoutes);
app.use(reviewRoutes);

startBookingStatusUpdater();

app.use((req, res) => {
  res.status(404).send({ msg: "Resource not found" });
});
app.use(handleServerError);

app.listen(8000, () => {
  console.log("server started....");
});
