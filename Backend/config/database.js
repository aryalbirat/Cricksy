const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://mongodb:27017/Cricksy")
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("MongoDB connection error:", err));
