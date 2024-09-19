const mongoose = require("mongoose");

const vehiclesChargingDetailsSchema = new mongoose.Schema(
  {
    model: String,
    make: String,
    year: Number,
    chargeType: String,
    chargingPoint: String,
    maxPower: String, // Consider storing as Number (in kW) for calculations
    power: String, // Consider storing as Number (in kW) for calculations
    time: String, // Could be a duration string (e.g., "2 hours 30 minutes")
    rate: String, // Could be a formatted string (e.g., "7.4 kW")
    range1: Number,
    range2: Number,
    rateSocTime: String, // Consider storing rate, SoC change, and time separately
  },
  { collection: "VehiclesChargingDetails" }
); // Explicit collection name

module.exports = mongoose.model(
  "vehiclesChargingDetails",
  vehiclesChargingDetailsSchema
);

