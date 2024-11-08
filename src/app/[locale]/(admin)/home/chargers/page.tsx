"use client";

import { getAllChargerMasterData } from "@/actions/admin/chargingModule/getAllChargerMasterData";
import PageName from "@/components/ui/commons/PageName";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Fragment, useEffect, useState } from "react";

interface ChargerRow {
  chargerID: string;
  chargerLocation: string;
  chargerStatus: string;
  dateJoining: string;
  chargeType: string;
  chargingPoint: string;
}

const page = () => {
  const [chargerMasterData, setChargerMasterData] = useState<ChargerRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const columns: GridColDef[] = [
    { field: "chargerID", headerName: "Charger ID", width: 130 },
    {
      field: "chargerLocation",
      headerName: "Charger Location",
      width: 200,
      valueFormatter: (params: GridRenderCellParams<any>) =>
        params.value
          ? `${[
              Number(params.value.toString().split(",")[0]).toFixed(2),
              Number(params.value.toString().split(",")[1]).toFixed(2),
            ].join(", ")}`
          : "",
    },
    { field: "chargerStatus", headerName: "Charger Status", width: 130 },
    {
      field: "dateJoining",
      headerName: "Date Joining",
      width: 130,
      valueFormatter: (params: GridRenderCellParams<any>) =>
        params.value ? new Date(params.value).toLocaleDateString() : "",
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
          setChargerMasterData(data);
        } else {
          console.warn("Expected data to be an array:", data);
        }
      } catch (error) {
        console.error("Error fetching charger master data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Fragment>
      <PageName
        name={"Chargers"}
        breadcrumbs={[
          { name: "Home", href: "/home" },
          { name: "Chargers", href: "/home/chargers" },
        ]}
      />
      <div className="container">
        <div className="max-h-screen overflow-y-auto">
          <div style={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={chargerMasterData}
              columns={columns}
              loading={isLoading}
              autoHeight
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10]}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default page;
