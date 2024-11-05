"use client";

import { getChargingSchedule } from "@/actions/admin/chargingSchedule/getChargingSchedule";
import PageName from "@/components/ui/commons/PageName";
import { Button, Container } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import ScheduleIcon from "@mui/icons-material/Schedule";
const page = () => {
  const [chargingSchedule, setChargingSchedule] = useState([]);

  const handleCreateSchedule = async () => {
    try {
      const data = await getChargingSchedule();
      setChargingSchedule(data);
    } catch (error) {
      console.error("Error fetching charger master data:", error);
      // Handle the error appropriately (e.g., show an error message)
    }
  };

  return (
    <Fragment>
      <PageName
        // name={t("title")}
        name={"Charge Scheduling"}
        breadcrumbs={[
          { name: "Home", href: "/home" },
          { name: "Scheduling", href: "/home/scheduling" },
        ]}
      />
      <Container sx={{ display: "flex", justifyContent: "right" }}>
        <Button
          startIcon={<ScheduleIcon />}
          variant="contained"
          sx={{ m: 1 }}
          onClick={handleCreateSchedule}
        >
          Create Schedule
        </Button>
      </Container>
      {chargingSchedule && chargingSchedule.length > 0 && (
        <div className="container">
          <div className="max-h-screen overflow-y-auto">
            {/* <h2>Charger Master Data</h2> */}
            <table className="table-auto w-full">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="border px-2 py-2">Vehicle VIN</th>
                  <th className="border px-2 py-2">Vehicle SOC</th>
                  <th className="border px-2 py-2">Charger ID</th>
                  <th className="border px-2 py-2">Charger Location</th>
                  <th className="border px-2 py-2">Schedule Date</th>
                </tr>
              </thead>
              <tbody>
                {chargingSchedule.map((schedule) => (
                  <tr key={schedule.vehicle.vin} className="text-sm">
                    <td className="border px-4 py-2">{schedule.vehicle.vin}</td>
                    <td className="border px-4 py-2">{schedule.vehicle.soc}</td>
                    <td className="border px-4 py-2">
                      {schedule.charger.chargerID}
                    </td>
                    {/* Format the date */}
                    <td className="border px-4 py-2">
                      {schedule.charger.chargerLocation}
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(schedule.scheduleDate).toLocaleDateString()}
                    </td>{" "}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default page;
