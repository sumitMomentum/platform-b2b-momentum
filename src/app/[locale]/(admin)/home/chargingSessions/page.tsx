"use client";

import { getChargingSessions } from "@/actions/admin/chargingModule/getAllChargingSessions";
import PageName from "@/components/ui/commons/PageName";
import ChargingList from "@/components/ui/componenets/ChargingListComponent";
import { Fragment, useEffect, useState } from "react";

const ChargingSessionsPage = () => {
  const [chargingSessions, setChargingSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getChargingSessions();
        console.log("Charging sessions data:", data);
        if (data && data.sessions) {
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
        name={"Charging Sessions"}
        breadcrumbs={[
          { name: "Home", href: "/home" },
          { name: "Charging Sessions", href: "/home/chargingSessions" },
        ]}
      />
      <div className="container">
        <div className="max-h-screen overflow-y-auto p-4">
          <ChargingList
            loading={isLoading}
            chargingSessions={chargingSessions}
          />
          {/* {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <span>Loading charging sessions...</span>
            </div>
          ) : (
            <ChargingList />
          )} */}
        </div>
      </div>
    </Fragment>
  );
};

export default ChargingSessionsPage;
