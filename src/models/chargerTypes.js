const mongoose = require('mongoose');

const chargerMasterSchema = new mongoose.Schema({
  chargerID: { type: Number, required: true, unique: true },  // Assuming unique charger IDs
  chargerLocation: String, 
  chargerStatus: String, 
  dateJoining: Date,  
  chargeType: String,
  chargingPoint: String 
}, { collection: 'ChargerMaster' }); // Explicit collection name

module.exports = mongoose.model("ChargerMaster", chargerMasterSchema);

