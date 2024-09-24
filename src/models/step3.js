// models/step3.js
const mongoose = require("mongoose");

const step3Schema = new mongoose.Schema(
  {
    vehicleId: { type: String, required: true },
    Severity: String,
    Description: String,
    BestPractice: String,
    ActionToBeTaken: String,
    Confirm: Number, // Assuming 0/1 for confirmation
    CreatedDateTime: String,
    ClosedDateTime: String,
  },
  { collection: "Step3" }
);

module.exports =  mongoose.models.Step3 ||mongoose.model("Step3", step3Schema);
