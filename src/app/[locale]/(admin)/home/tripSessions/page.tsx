"use client";

import { getTripSessions } from "@/actions/admin/tripModule/getAllTripSessions";
import PageName from "@/components/ui/commons/PageName";
import TripList from "@/components/ui/componenets/TripListComponent";
import { log } from "console";
import { Fragment, useEffect, useState } from "react";
import { isArray } from "util";

const page = () => {
  const [tripSessions, setTripSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTripSessions();

        if (!data) {
          console.error("[CLIENT] No data received from server");
          return;
        }

        if (data.sessions) {
          const sessions = data.sessions;

          setTripSessions(sessions);
        } else {
          console.warn("[CLIENT] Data received but no sessions found:", data);
        }
      } catch (error) {
        console.error("[CLIENT] Error details:", {
          message: error.message,
          stack: error.stack,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {}, [tripSessions]);

  return (
    <Fragment>
      <PageName
        name={"Trip Sessions"}
        breadcrumbs={[
          { name: "Home", href: "/home" },
          { name: "Trip Sessions", href: "/home/tripSessions" },
        ]}
      />
      <div className="container">
        <div className="max-h-screen overflow-y-auto p-4">
          <TripList tripSessions={tripSessions} loading={isLoading} />
          {/* {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <span>Loading trip sessions...</span>
            </div>
          ) : (
            <TripList tripSessions={tripSessions} loading={isLoading} />
          )} */}
        </div>
      </div>
    </Fragment>
  );
};

export default page;
