// models/step3.js
const mongoose = require("mongoose");

const step3Schema = new mongoose.Schema(
  {
    vehicleID: { type: String, required: true },
    severity: String,
    description: String,
    bestPractice: String,
    actionToBeTaken: String,
    confirm: Number, // Assuming 0/1 for confirmation
    createdDateTime: String,
    closedDateTime: String,
  },
  { collection: "Step3" }
);

module.exports = mongoose.model("Step3", step3Schema);
