import { NextResponse } from "next/server";
import prisma from "@/lib/db"; // Adjust the import according to your Prisma client setup
import chalk from "chalk";

export async function GET() {
  try {
    const chargers = await prisma.chargerMaster.findMany(); // Adjust the model name according to your schema
    console.log(chalk.blue("Returning Chargers"));

    return NextResponse.json(chargers);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}


