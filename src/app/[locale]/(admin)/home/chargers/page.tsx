"use client";

import { getAllChargerMasterData } from "@/actions/admin/chargingModule/getAllChargerMasterData";
import PageName from "@/components/ui/commons/PageName";
import { Fragment, useEffect, useState } from "react";

const page = () => {
  const [chargerMasterData, setChargerMasterData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllChargerMasterData();
        setChargerMasterData(data);
      } catch (error) {
        console.error("Error fetching charger master data:", error);
        // Handle the error appropriately (e.g., show an error message)
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
