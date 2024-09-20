export const getAllChargerMasterData = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_BASE_URL}/api/vehicles/charging/allChargerMaster`
    );

    if (!response.ok) {
      throw new Error(
        `Error fetching charger master data: ${response.status} ${response.statusText}`
      );
    }

    const chargerMasterData = await response.json();
    return chargerMasterData;
  } catch (error) {
    console.error("Error fetching charger master data:", error);
    // Handle the error appropriately (e.g., show an error message to the user)
    return []; // Or you could return null or throw the error further up the call stack
  }
};
