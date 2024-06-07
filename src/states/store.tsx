import { create } from "zustand";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  odometer: number;
  batteryCapacity: number;
  ownerId: number;
  dateOfConnection: Date;
  soc: number;
  createdAt: Date;
  updatedAt: Date;

  // Add any other fields present in your Vehicle model
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
