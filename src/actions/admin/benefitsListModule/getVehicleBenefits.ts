export const getVehicleBenefits = async () => {
  try {
    console.log(`${process.env.BACKEND_URL}/api/vehicles/allVehiclesStep7`);       

    const response = await fetch(
      `https://demoapi-9d35.onrender.com/api/vehicles/allVehiclesStep7`
    );


    if (!response.ok) {
      throw new Error(
        `Error fetching step 3 data: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    console.log(data)
    return data;
  } catch (error) {
    console.error("Error fetching step 7 data:", error);
    // Handle error (e.g., show error message to the user)
    return []; // Or return an error object
  }
};
