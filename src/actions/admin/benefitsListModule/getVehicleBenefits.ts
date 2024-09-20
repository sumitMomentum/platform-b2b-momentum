export const getVehicleBenefits = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_BASE_URL}/api/vehicles/allVehiclesStep7`
    );
    if (!response.ok) {
      throw new Error(
        `Error fetching step 3 data: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching step 3 data:", error);
    // Handle error (e.g., show error message to the user)
    return []; // Or return an error object
  }
};
