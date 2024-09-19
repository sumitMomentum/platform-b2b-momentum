const mongoose = require("mongoose");

const step7Schema = new mongoose.Schema(
  {
    vehicleId: { type: String, required: true },
    batteryCycleSavingMonthly: Number,
    batteryCycleSavingYearly: Number,
    batteryCycleSavingLifetime: Number,
    costSavingChargingMonthly: Number,
    costSavingChargingYearly: Number,
    costSavingChargingLifeTimeEstimate: Number,
    rangeIncreaseMonthly: Number,
    rangeIncreaseYearly: Number,
    rangeIncreaseLifetimeEstimate: Number,
    revenueIncreaseLifeTime: Number,
  },
  { collection: "Step7" }
);

const Step7 = mongoose.model("Step7", step7Schema);

module.exports = Step7;
