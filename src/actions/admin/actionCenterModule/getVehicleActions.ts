export const getVehicleActions = async () => {
  try {
    const response = await fetch(
      "https://demoapi-9d35.onrender.com/api/vehicles/allVehiclesStep3"
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
