import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const benefits = await prisma.benefit.findMany(); // Adjust the model name according to your schema

    return NextResponse.json(benefits);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
