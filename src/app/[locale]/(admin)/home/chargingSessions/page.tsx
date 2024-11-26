"use client";

import { getChargingSessions } from "@/actions/admin/chargingModule/getAllChargingSessions";
import PageName from "@/components/ui/commons/PageName";
import ChargingList from "@/components/ui/componenets/ChargingListComponent";
import { Fragment, useEffect, useState } from "react";

// Define the interface for the Charging Session
interface ChargingSession {
  id: number;
  TripID: number;
  DteStart: string;
  DteEnd: string;
  BatteryAtStart: number;
  BatteryAtEnd: number;
  DwUpdated: string; // ISO date string
  DiffInBat: number;
  ChargingType: string;
  DiffInDte: number;
  vehicleId: string;
  chargerId: number;
}

const ChargingSessionsPage: React.FC = () => {
  const [chargingSessions, setChargingSessions] = useState<ChargingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getChargingSessions();
        if (data && data.sessions) {
          console.log(data.sessions);
          setChargingSessions(data.sessions);
        } else {
          console.warn("Expected data to contain sessions:", data);
        }
      } catch (error) {
        console.error("Error fetching charging sessions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Fragment>
      <PageName
        name="Charging Sessions"
        breadcrumbs={[
          { name: "Home", href: "/home" },
        ]}
      />
      <div className="container">
        <div className="max-h-screen overflow-y-auto p-4">
          <ChargingList loading={isLoading} chargingSessions={chargingSessions} />
        </div>
      </div>
    </Fragment>
  );
};

export default ChargingSessionsPage;
