"use client";
import { getUserVehicles } from "@/actions/admin/userModule/get-user-vehicles";
import page from "@/app/[locale]/(landing)/page";
import useVehicleStore from "@/states/store";
import { useRouter } from "next/navigation";
import { type } from "os";
import { useEffect, useState } from "react"; // Import only useEffect
import { DataGrid, GridEventListener } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { handleEvent } from "@/utils/facades/serverFacades/enodeFacade";
import { title } from "process";
import { getUserVehicleEnode } from "@/actions/admin/userModule/get-user-vehicle-enode";
import { map } from "svix/dist/openapi/rxjsStub";

const columns = [
  { field: "vin", headerName: "VIN", flex: 1 },
  { field: "make", headerName: "Make", flex: 1 },
  { field: "model", headerName: "Model", flex: 1 },
  {
    field: "soc",
    headerName: "SOC",
    // type: "number",
    flex: 1,
  },
];

const paginationModel = { page: 0, pageSize: 10 };

const VehicleList = () => {
  const [finalVehicles, setFinalVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const vehicles = useVehicleStore((state) => state.vehicles);
  const setVehicles = useVehicleStore((state) => state.setVehicles);
  const [enodeVehicles, setEnodeVehicles] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVehicleEnode, setSelectedVehicleEnode] = useState(null);
  const setSelectedVehicleId = useVehicleStore(
    (state) => state.setSelectedVehicleId
  );
  const selectedVehicleId = useVehicleStore((state) => state.selectedVehicleId);

  useEffect(() => {
    const getVehicles = async () => {
      if (!vehicles || vehicles.length === 0) {
        const userVehiclesFromDB = await getUserVehicles();
        setVehicles(userVehiclesFromDB);
        setSelectedVehicleId("");
      }
    };

    const getEnodeVehicles = async () => {
      const fetchedEnodeVehicles = await getUserVehicleEnode();
      setEnodeVehicles(fetchedEnodeVehicles.linkedVendors);
    };

    const initializeData = async () => {
      // await Promise.all([getVehicles(), getEnodeVehicles()])

      // // Simply combine both arrays
      // const combinedVehicles = [...vehicles, ...enodeVehicles];
      // //  console.log("[...vehicles]", [...vehicles]);
      // console.log("[...enodeVehicles]", [...enodeVehicles]);
      // //  console.log("combinedVehicles", combinedVehicles);
      // setFinalVehicles(combinedVehicles);
      await getVehicles();
      setFinalVehicles(vehicles);
      setLoading(false);
    };

    initializeData();
  }, [vehicles, setVehicles, setSelectedVehicleId, enodeVehicles]);

  const handleRowClickEvent: GridEventListener<"rowClick"> = (
    params, // GridRowParams
    event, // MuiEvent<React.MouseEvent<HTMLElement>>
    details // GridCallbackDetails
  ) => {
    setSelectedVehicleId(params.row.vehicleId);
    router.push(`/home/vehicles/${params.row.vehicleId}`);
  };

  const handleDelete = async () => {
    if (selectedVehicleEnode) {
      try {
        // await deleteUserVehicleEnode(selectedVehicleEnode);
        // await getEnodeVehicles();
        setShowDeleteModal(false);
        setSelectedVehicleEnode(null);
        setTimeout(() => {}, 5000);
        window.location.reload();
      } catch (error) {
        console.error("Failed to delete vendor", error);
      }
    }
  };

  const handleDeleteClick = (vehicleEnode: string) => {
    setSelectedVehicleEnode(vehicleEnode);
    setShowDeleteModal(true);
  };

  const handleCancel = () => {
    setShowDeleteModal(false);
    setSelectedVehicleEnode(null);
  };

  // <div className="flex w-full flex-col overflow-x-auto" id="vehicleTable">
  return (
    <Paper sx={{ height: "auto", width: "100%" }}>
      <DataGrid
        autoPageSize
        loading={loading}
        onRowClick={handleRowClickEvent}
        getRowId={(row) => row.vehicleId}
        rows={finalVehicles}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        // checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
  // </div>;
};

export default VehicleList;
