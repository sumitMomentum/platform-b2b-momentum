// models/step1.js
const mongoose = require("mongoose");

const step1Schema = new mongoose.Schema(
  {
    vehicleID: { type: String, required: true },
    legType: String,
    dateStart: Number, // Assuming timestamps are stored as integers
    dateEnd: Number,
    batteryAtStart: Number,
    batteryAtEnd: Number,
    dateUpdated: String,
    diffInBattery: Number,
    chargingGeo: String,
    chargingType: String,
  },
  { collection: "Step1" }
);

module.exports = mongoose.model("Step1", step1Schema);
