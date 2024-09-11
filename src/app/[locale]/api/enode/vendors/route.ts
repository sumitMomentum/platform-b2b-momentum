"use server";
import prisma from "@/lib/db";
import axios from 'axios'
import { NextResponse } from "next/server";
// import { VendorStatus,VendorData } from "@prisma/client";
import { getNow } from "next-intl/server";

const authUrl = process.env.ENODE_AUTH_URL

const baseUrl = process.env.ENODE_BASE_URL

interface VendorDto {
    displayName: String
    vendor: String
    portalName: String
    // status: VendorStatus
    // linkingStatus: VendorStatus
}

export async function GET() {


    try {
        // // Fetch access token from Enode using code
        // const { data } = await axios.post(authUrl, {
        //     grant_type: "client_credentials",
        // }, {
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //         'Authorization': 'Basic Yzg4ZTJlZDQtNzNlMy00NmUxLTg5ZmYtNDkxMGRlYWZmZjBjOmFjOTU3NzlhZGExMmFjOTUyODc2MzM0M2MwYjA5ZTI2YjU5NmQ5NmU='
        //     }
        // })

        // if (!data.access_token) {
        //     throw new Error('No access token found.')
        // }

        // // Fetch vendors  using access token
        // const vendorsData = await axios.get(baseUrl + '/health/vehicles', {
        //     headers: {
        //         Authorization: `Bearer ${data.access_token}`
        //     }
        // })
        // vendorsData.data.forEach(async (vdata: VendorDto) =>  {
        //     await prisma.vendorData.upsert({
        //         where: { 
        //             vendor:  vdata.vendor.toString(),
        //         },
        //         update: {
        //             displayName: vdata.displayName.toString(),
        //             portalName: vdata.portalName.toString(),
        //             status: vdata.status,
        //             linkingStatus: vdata.linkingStatus,
        //         },
        //         create: {
        //             vendor: vdata.vendor.toString(),
        //             displayName: vdata.displayName.toString(),
        //             portalName: vdata.portalName.toString(),
        //             status: vdata.status,
        //             linkingStatus: vdata.linkingStatus,
        //         },
        //     });
        // })
        
        return NextResponse.json("REPLACE IT", { status: 500 })

    } catch (e) {
        console.log(e)
        return NextResponse.json("Error", { status: 500 });
    }
}