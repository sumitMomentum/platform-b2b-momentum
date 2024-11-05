'use server'

export async function uploadVehiclesFromCSV(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      throw new Error('No file provided');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vehicle/csv/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload vehicles');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading vehicles:', error);
    throw error;
  }
}

