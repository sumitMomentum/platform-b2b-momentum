const fetchVehicleData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/vehicle/id`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch vehicle data');
      }
      const vehicles = await response.json();
      return vehicles.map((vehicle: { id: number; vehicleId: string; vin: string }) => ({
        id: vehicle.id,
        vehicleId: vehicle.vehicleId,
        vin: vehicle.vin,
      }));
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
      throw error;
    }
  };
  
  export default fetchVehicleData;
  