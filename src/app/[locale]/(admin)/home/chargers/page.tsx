"use client";

import { getAllChargerMasterData } from "@/actions/admin/chargingModule/getAllChargerMasterData";
import PageName from "@/components/ui/commons/PageName";
import { GridColDef } from "@mui/x-data-grid";
import { warn } from "console";
import { split } from "postcss/lib/list";
import { Fragment, useEffect, useState } from "react";
import { isArray } from "util";

const page = () => {
  const [chargerMasterData, setChargerMasterData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const columns: GridColDef[] = [
    { field: "chargerID", headerName: "Charger ID", width: 130 },
    {
      field: "chargerLocation",
      headerName: "Charger Location",
      width: 200,
      valueFormatter: (value: any, row: any) =>
        `${[
          Number(value.toString().split(",")[0]).toFixed(2),
          Number(value.toString().split(",")[1]).toFixed(2),
        ].join(", ")}`,
    },
    { field: "chargerStatus", headerName: "Charger Status", width: 130 },
    {
      field: "dateJoining",
      headerName: "Date Joining",
      width: 130,
      valueFormatter: (value, row) => new Date(value).toLocaleDateString(),
    },
    { field: "chargeType", headerName: "Charge Type", width: 130 },
    { field: "chargingPoint", headerName: "Charging Point", width: 130 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllChargerMasterData();
        console.log("from the component:", data);
        if (Array.isArray(data)) {
          // Confirming data is an array
          setChargerMasterData(data);
        } else {
          console.warn("Expected data to be an array:", data);
        }
      } catch (error) {
        console.error("Error fetching charger master data:", error);
      } finally {
        setIsLoading(false); // Set loading to false once complete
      }
    };

    fetchData();
  }, []);

  return (
    <Fragment>
      <PageName
        // name={t("title")}
        name={"Chargers"}
        breadcrumbs={[
          { name: "Home", href: "/home" },
          { name: "Chargers", href: "/home/chargers" },
        ]}
      />
      <div className="container">
        <div className="max-h-screen overflow-y-auto">
          {/* <h2>Charger Master Data</h2> */}
          <table className="table-auto w-full">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="border px-2 py-2">Charger ID</th>
                <th className="border px-2 py-2">Charger Location</th>
                <th className="border px-2 py-2">Charger Status</th>
                <th className="border px-2 py-2">Date Joining</th>
                <th className="border px-2 py-2">Charge Type</th>
                <th className="border px-2 py-2">Charging Point</th>
              </tr>
            </thead>
            <tbody>
              {chargerMasterData.map((charger) => (
                <tr key={charger.chargerID} className="text-sm">
                  <td className="border px-4 py-2">{charger.chargerID}</td>
                  <td className="border px-4 py-2">
                    {charger.chargerLocation}
                  </td>
                  <td className="border px-4 py-2">{charger.chargerStatus}</td>
                  <td className="border px-4 py-2">
                    {new Date(charger.dateJoining).toLocaleDateString()}
                  </td>{" "}
                  {/* Format the date */}
                  <td className="border px-4 py-2">{charger.chargeType}</td>
                  <td className="border px-4 py-2">{charger.chargingPoint}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
};

export default page;
