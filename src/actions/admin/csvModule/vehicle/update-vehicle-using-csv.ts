'use server'

export async function updateVehiclesFromCSV(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      throw new Error('No file provided');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vehicle/csv/update`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update vehicles');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating vehicles:', error);
    throw error;
  }
}
import { ok } from "assert";
import { get } from "http";
import { env } from "process";
import { json } from "stream/consumers";
