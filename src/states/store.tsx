import { chargingSessions } from "@/seed/seeds/chargingSession";
import { tripSessions } from "@/seed/seeds/tripSession";
import { ChargingSession, VehicleTripSession, User } from "@prisma/client";
import { id } from "date-fns/locale";
import { create } from "zustand";

interface Vehicle {
  id: string; // Unique ID for each vehicle detail
  vin?: string; // Vehicle Identification Number
  vehicleId?: string; // ID of the vehicle
  model?: string; // Vehicle model
  year?: number; // Year of the vehicle
  batteryCapacity?: number; // Battery capacity in kWh
  ownerID?: number; // Owner ID
  soc?: number; // State of Charge percentage
  dateOfConnection?: Date; // Date of connection
  odometerFloat?: number; // Odometer reading
  usageAverageDailyKmDriven?: number[]; // Array of average daily km driven
  monthlyUsage?: number[]; // Array of monthly usage
  condition?: string; // Condition of the vehicle (e.g., "Good")
  status?: string; // Status of the vehicle (e.g., "Active")
  make?: string; // Vehicle make
  batteryHealthSoH?: number; // State of Health of the battery
  batteryHealthDegradation?: number; // Degradation of the battery
  location?: string; // Location (e.g., "Bangalore, India")
  soh?: number[]; // Array of state of health values
  batteryHealthAverageEstimatedDegradation?: number[]; // Array of estimated degradation values
  batteryHealthAverageSoC?: number; // Average State of Charge of the battery
  batteryHealthTotalBatteries?: number; // Total number of batteries
  connectorType?: string; // Type of connector (e.g., "Rapid")
  endOfLife?: string; // End of life estimate
  realRangeObserved?: number; // Observed real range
  remainingUsefulLife?: string; // Remaining useful life estimate
  totalChargingSession?: number; // Total number of charging sessions
  totalEnergyConsumed?: string; // Total energy consumed
  vehicleConditionCritical?: number; // Critical condition count
  vehicleConditionGood?: number; // Good condition count
  vehicleConditionSatisfactory?: number; // Satisfactory condition count
  vehicleStatusActive?: number; // Active status count
  vehicleStatusCharging?: number; // Charging status count
  vehicleStatusInUse?: number; // In-use status count
  vehicleStatusOutOfService?: number; // Out-of-service status count
  epawltpProvidedRange?: number; // Provided range (EPA WLTP)
  usageRangeObservedMax?: number; // Maximum observed range
  usageRangeObservedMin?: number; // Minimum observed range
  usageSoCRangeMax?: number; // Maximum state of charge range
  usageSoCRangeMin?: number; // Minimum state of charge range
  usageTemperatureHigh?: number; // Maximum temperature observed
  usageTemperatureLow?: number; // Minimum temperature observed
  batteryChemistry?: string; // Chemistry of the battery (e.g., "Lithium-ion")
  batteryHealthAverageSoH?: number; // Average state of health of the battery
  dataPointsCollected?: number; // Number of data points collected
  averageMonthlyUsage?: number; // Average monthly usage
  ownerId: number; // Foreign key to the owner
  chargingSessions?: ChargingSession[]; // Array of related charging sessions
  tripSessions?: VehicleTripSession[]; // Array of related trip sessions
  owner?: User; // Related user entity (Owner)
  createdAt?: Date; // Creation date (if applicable)
  updatedAt?: Date; // Update date (if applicable)
}


interface VehicleStore {
  vehicles: Vehicle[];
  selectedVehicleId: string;
  setVehicles: (vehicles: Vehicle[]) => void;
  setSelectedVehicleId: (id: string) => void;
}

const loadStateFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem("vehicleStore");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Error loading state from localStorage:", err);
    return undefined;
  }
};

const saveStateToLocalStorage = (state: VehicleStore) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("vehicleStore", serializedState);
  } catch (err) {
    console.error("Error saving state to localStorage:", err);
  }
};

const useVehicleStore = create<VehicleStore>((set) => ({
  vehicles: [],
  selectedVehicleId: "",
  setVehicles: (vehicles) =>
    set((state) => {
      const newState = { ...state, vehicles };
      
      saveStateToLocalStorage(newState);
      return newState;
    }),
  setSelectedVehicleId: (id: string) =>
    set((state) => {
      const newState = { ...state, selectedVehicleId: id };
      saveStateToLocalStorage(newState);
      return newState;
    }),
}));

// Load initial state from localStorage when the store is created
const initialState = loadStateFromLocalStorage();
if (initialState !== undefined) {
  useVehicleStore.setState(initialState);
}

export default useVehicleStore;
