"use server"

export const getChargingSchedule = async () => {
  try {
    const chargersRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/chargers`
    );
    const vehiclesRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/vehicle`
    );

    if (!chargersRes.ok || !vehiclesRes.ok) {
      throw new Error(
        `Error fetching data: ${chargersRes.status} ${chargersRes.statusText} or ${vehiclesRes.status} ${vehiclesRes.statusText}`
      );
    }
    console.log("chargers:", chargersRes)
    console.log("vehicles:", vehiclesRes)

    // Parse the JSON data from both responses
    const chargers = await chargersRes.json();
    const vehicles = await vehiclesRes.json();


    // Sort vehicles by 'soc' (lowest first) and chargers by 'chargerID'
    const sortedVehicles = vehicles.sort((a, b) => a.soc - b.soc);
    const sortedChargers = chargers.sort((a, b) => a.chargerID - b.chargerID);

    // Create pairs of vehicles and chargers
    const chargingSchedule = sortedVehicles.map((vehicle, index) => {
      const chargerIndex = index % sortedChargers.length; // Cyclic assignment if vehicles > chargers

      const scheduleDate = new Date();
      scheduleDate.setDate(
        scheduleDate.getDate() + Math.floor(index / sortedChargers.length)
      );

      return {
        vehicle,
        charger: sortedChargers[chargerIndex],
        scheduleDate: scheduleDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
      };
    });

    // Return the complete pairs sorted by vehicle 'soc'
    return chargingSchedule;
  } catch (error) {
    console.error("Error fetching charger or vehicle data:", error);
    return []; // Return an empty array or handle the error as needed
  }
};
// "use server"

// export const getChargingSchedule = async () => {
//   try {
//     const chargersRes = await fetch(
//       `https://demoapi-9d35.onrender.com/api/vehicles/charging/allChargerMaster`
//     );
//     const vehiclesRes = await fetch(
//       `https://demoapi-9d35.onrender.com/api/vehicles/allVehicleDetails`
//     );

//     if (!chargersRes.ok || !vehiclesRes.ok) {
//       throw new Error(
//         `Error fetching data: ${chargersRes.status} ${chargersRes.statusText} or ${vehiclesRes.status} ${vehiclesRes.statusText}`
//       );
//     }

//     // Parse the JSON data from both responses
//     const chargers = await chargersRes.json();
//     const vehicles = await vehiclesRes.json();

//     // Sort vehicles by 'soc' (lowest first) and chargers by 'chargerID'
//     const sortedVehicles = vehicles.sort((a, b) => a.soc - b.soc);
//     const sortedChargers = chargers.sort((a, b) => a.chargerID - b.chargerID);

//     // Create pairs of vehicles and chargers
//     const chargingSchedule = sortedVehicles.map((vehicle, index) => {
//       const chargerIndex = index % sortedChargers.length; // Cyclic assignment if vehicles > chargers

//       const scheduleDate = new Date();
//       scheduleDate.setDate(
//         scheduleDate.getDate() + Math.floor(index / sortedChargers.length)
//       );

//       return {
//         vehicle,
//         charger: sortedChargers[chargerIndex],
//         scheduleDate: scheduleDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
//       };
//     });

//     // Return the complete pairs sorted by vehicle 'soc'
//     return chargingSchedule;
//   } catch (error) {
//     console.error("Error fetching charger or vehicle data:", error);
//     return []; // Return an empty array or handle the error as needed
//   }
// };
