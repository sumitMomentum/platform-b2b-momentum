"use client";
import { useState, useEffect } from "react";
import { getTripSessions } from "@/actions/admin/tripModule/getAllTripSessions";
import PageName from "@/components/ui/commons/PageName";
import TripList from "@/components/ui/componenets/TripListComponent";

interface TripSession {
  id: number;
  TripID: number;
  DteStart: number;
  DteEnd: number;
  BatteryAtStart: number;
  BatteryAtEnd: number;
  DwUpdated: string;
  TripApprovedKilometer: number;
  DiffInBat: number;
  DiffInDte: number;
  createdAt: string;
  updatedAt: string;
  vehicleReference: string;
  vehicleId: string | null;
}

const Page = () => {
  const [tripSessions, setTripSessions] = useState<TripSession[]>([]);
  const [error, setError] = useState<string | null>(null); // Error state for better UX

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTripSessions();

        if (!data || !data.sessions) {
          console.error("[CLIENT] No sessions data received from server");
          setError("No trip sessions available");
          return;
        }

        // console.log("[CLIENT] Fetched Trip Sessions: ", data.sessions); // Logging the fetched data
        setTripSessions(data.sessions);
      } catch (error: any) {
        console.error("[CLIENT] Error details:", {
          message: error.message,
          stack: error.stack,
        });
        setError("Failed to load trip sessions. Please try again later.");
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <PageName
        name={"Trip Sessions"}
        breadcrumbs={[
          { name: "Home", href: "/home" },
          { name: "Trip Sessions", href: "/home/tripSessions" },
        ]}
      />
      <div className="container">
        <div className="max-h-screen overflow-y-auto p-4">
          {error ? (
            <div>{error}</div> // Show error message if there is one
          ) : (
            <TripList tripSessions={tripSessions} loading={false} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
