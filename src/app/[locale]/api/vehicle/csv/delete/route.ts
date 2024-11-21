import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { id } = req.query;

    try {
      const deletedVehicle = await prisma.vehicle.delete({
        where: { id: String(id) },
      });
      res.status(200).json({ message: 'Vehicle deleted successfully', vehicleId: id });
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      res.status(500).json({ error: 'Failed to delete vehicle' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
