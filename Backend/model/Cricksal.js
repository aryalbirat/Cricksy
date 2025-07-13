const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const CricksalSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  pricePerHour: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  location:{
    type: String,
  },
  
  images: {
    type: [String], // Supports multiple image paths
    required: true,
    validate: {
      validator: function (value) {
        return value.length >= 1; 
      },
      message: "At least 1 image is required.",
    },
  },
  createdBy: {
    ref: "User",
    type: ObjectId,
    required: true,
  },


});

const Cricksal = mongoose.model("Cricksal", CricksalSchema);

module.exports = Cricksal;
