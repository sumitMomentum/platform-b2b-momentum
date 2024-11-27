"use client";

import { useState, useEffect, useRef } from "react";
import { getAllChargerMasterData } from "@/actions/admin/chargingModule/getAllChargerMasterData";
import { uploadChargerDataFromCSV } from "@/actions/admin/csvModule/charging/upload-charger-data-using-csv"; // Adjust the import path if necessary
import PageName from "@/components/ui/commons/PageName";
import { Box, Button, IconButton, InputAdornment, TextField, Tooltip, Chip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import PowerIcon from "@mui/icons-material/Power";
import PowerOffIcon from "@mui/icons-material/PowerOff";
import InfoIcon from "@mui/icons-material/Info";
import FlashAutoIcon from "@mui/icons-material/FlashAuto";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import FlashOffIcon from "@mui/icons-material/FlashOff";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Fragment } from "react";

interface ChargerRow {
  id: number;
  chargerId: number;
  chargerLocation: string;
  chargerStatus: string;
  dateJoining: string;
  chargeType: string;
  chargingPoint: string;
}

const Page = () => {
  const [chargerMasterData, setChargerMasterData] = useState<ChargerRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchChargerMasterData = async () => {
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

  useEffect(() => {
    fetchChargerMasterData();
  }, []);

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    try {
      if (!selectedFile) {
        throw new Error("Please select a file to upload.");
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      const result = await uploadChargerDataFromCSV(formData);

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      window.alert(`Upload successful: ${result.message}`);

      // Rerun getAllChargerMasterData to fetch updated data
      await fetchChargerMasterData();

      // Log the aggregated actions
      console.log("[CLIENT] Aggregated Actions:", result.actions);
    } catch (error) {
      console.error("Upload error:", error);
      window.alert(`Error: ${error instanceof Error ? error.message : "Something went wrong"}`);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const columns: GridColDef[] = [
    { field: "chargerId", headerName: "Charger ID", minWidth: 200 },
    {
      field: "chargerLocation",
      headerName: "Charger Location",
      minWidth: 200,
      valueFormatter: (value: any) =>
        `${[
          Number(value.toString().split(",")[0]).toFixed(2),
          Number(value.toString().split(",")[1]).toFixed(2),
        ].join(", ")}`,
    },
    {
      field: "chargerStatus",
      headerName: "Charger Status",
      minWidth: 200,
      renderCell: (params) => (
        <Chip
          variant="outlined"
          label={params.value}
          color={
            params.value === "Active"
              ? "success"
              : params.value === "Charging"
              ? "warning"
              : params.value === "Inactive"
              ? "error"
              : "info"
          }
          icon={
            params.value === "Active" ? (
              <PowerIcon />
            ) : params.value === "Inactive" ? (
              <PowerOffIcon />
            ) : (
              <InfoIcon />
            )
          }
        />
      ),
    },
    {
      field: "dateJoining",
      headerName: "Date Joining",
      minWidth: 200,
      valueFormatter: (value) => new Date(value).toLocaleDateString(),
    },
    {
      field: "chargeType",
      headerName: "Charge Type",
      minWidth: 200,
      renderCell: (params) => (
        <Chip
          variant="outlined"
          label={params.value}
          icon={
            params.value.toLowerCase().includes("fast") ? (
              <FlashAutoIcon />
            ) : params.value.toLowerCase().includes("normal") ? (
              <FlashOnIcon />
            ) : (
              <FlashOffIcon />
            )
          }
        />
      ),
    },
    { field: "chargingPoint", headerName: "Charging Point", minWidth: 200 },
  ];

  return (
    <Fragment>
      <PageName
        name={"Chargers"}
        breadcrumbs={[
          { name: "Home", href: "/home" },
          { name: "Chargers", href: "/home/chargers" },
        ]}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, margin: 2 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            fullWidth
            label="Choose a .csv File"
            variant="outlined"
            color="primary"
            size="small"
            sx={{
              "& .MuiInputBase-input": {
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              },
            }}
            value={fileInputRef.current?.files?.[0]?.name || ""}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <Tooltip title={selectedFile ? "Change File" : "Browse"} placement="bottom" color="primary">
                    <IconButton color="primary" onClick={handleButtonClick} size="small">
                      {selectedFile ? <ChangeCircleIcon /> : <AddCircleIcon />}
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
              readOnly: true,
            }}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            style={{ display: "none" }}
          />
        </Box>
        <Button startIcon={<FileUploadIcon />} variant="contained" color="primary" onClick={handleUpload}>
          Upload
        </Button>
      </Box>
      <div className="container">
        <Box style={{ display: "flex", width: "100%", height: "70vh" }}>
          <DataGrid
            rows={chargerMasterData}
            columns={columns}
            autosizeOnMount
            getRowId={(row) => row.id} // Ensure the row ID is unique
            loading={isLoading}
            autoHeight={true}
            disableColumnMenu
            pageSizeOptions={[5, 10]}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            sx={{
              ".MuiDataGrid-columnHeaders": {
                fontWeight: "bold",
                fontSize: "0.9rem", // Optional: Adjust font size for better visibility
              },
              ".MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold", // Ensures header titles specifically are bold
              },
            }}
          />
        </Box>
      </div>
    </Fragment>
  );
};

export default Page;
