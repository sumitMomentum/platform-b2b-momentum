const mongoose = require("mongoose");

const vehicleDetailsSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId, // Explicitly define _id as ObjectId
    vin: { type: String, required: true, unique: true },
    vehicleId: { type: String, required: true, unique: true },
    make: String,
    model: String,
    year: Number,
    batteryCapacity: Number,
    ownerId: Number, // Assuming ownerID is a numerical identifier
    soc: Number,
    dateOfConnection: Date,
    odometerFloat: Number, // Assuming you want to store floating-point values for odometer
    soh: Number,
    usageAverageDailyKmDriven: [Number], // Array of numbers for daily km driven
    monthlyUsage: [Number], // Array of numbers for monthly usage
    usageSoCRange: String,
    usageRangeObservedMin: Number, // Split the range into min and max
    usageRangeObservedMax: Number,
    usageTemperatureLow: Number, // Split the temperature into low and high
    usageTemperatureHigh: Number,
    usageObserved: Number, // Split the observed vs EPA/WLTP into two fields
    epaWltpProvided: Number,
    condition: String,
    status: String,
  },
  { collection: "VehicleDetails" }
); // Specify the collection name

module.exports = mongoose.model("VehicleDetails", vehicleDetailsSchema);
