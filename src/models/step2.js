const mongoose = require("mongoose");

const step2Schema = new mongoose.Schema(
  {
    vehicleId: { type: String, required: true },
    averageSoC: Number,
    averageDailyKm: Number,
    realRangeObserved: Number,
    totalChargingSession: Number,
    totalEnergyConsumed: Number,
    connectorType: String,
    monthlyUsage: [Number],
    socRange: String,
    rangeObservedMinMax: String,
    temperatureMinMax: String,
    soh: [Number],
    observedEpaProvided: String,
    endOfLife: Date,
    remainingUsefulLife: String,
  },
  { collection: "Step2" }
); // Explicit collection name

module.exports = mongoose.model("Step2", step2Schema);
