import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/db"; // Adjust the import path as needed

// GET request handler
export async function GET(req: NextRequest) {
    try {
        const actions = await prisma.action.findMany();

        // Group actions by vehicleId
        const actionsGroupedByVehicle = actions.reduce((acc, action) => {
            // Check if vehicleId exists in the accumulator
            if (!acc[action.vehicleId]) {
                acc[action.vehicleId] = { totalActions: 0, openActions: 0 };
            }
            // Increment totalActions for the vehicleId
            acc[action.vehicleId].totalActions += 1;

            // Increment openActions if the action is not confirmed
            if (action.confirm === 0) {
                acc[action.vehicleId].openActions += 1;
            }

            return acc;
        }, {} as Record<string, { totalActions: number; openActions: number }>);

        // Calculate the adjusted actions for each vehicleId
        const result = Object.entries(actionsGroupedByVehicle).map(([vehicleId, counts]) => {
            const { totalActions, openActions } = counts;
        
            // Ensure totalActions is not zero to avoid division by zero
            const actualDegradation = totalActions > 0 
                ? (openActions / totalActions) * 0.025 
                : 0; // Default to 0 if there are no actions
        
            return { 
                vehicleId, 
                totalActions, 
                openActions, 
                actualDegradation: parseFloat(actualDegradation.toFixed(2)) // Convert to float and limit to 2 decimal places
            };
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in GET handler:", error); // Log the error for debugging
        return NextResponse.json(
            { error: 'Failed to fetch action center data', details: error.message },
            { status: 500 }
        );
    }
}