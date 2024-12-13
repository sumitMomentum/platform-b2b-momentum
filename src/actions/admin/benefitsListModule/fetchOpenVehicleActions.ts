"use server";

const fetchOpenVehicleActions = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/vehicleActions/open`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch open vehicle actions");
    }
    const actions = await response.json();
    return actions;
  } catch (error) {
    console.error("Error fetching open vehicle actions:", error);
    throw error;
  }
};

export default fetchOpenVehicleActions;
