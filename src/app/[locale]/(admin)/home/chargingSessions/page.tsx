"use client";

import { useState, useEffect, useRef } from "react";
import { getChargingSessions } from "@/actions/admin/chargingModule/getAllChargingSessions";
import { uploadChargingSessionsFromCSV } from "@/actions/admin/csvModule/charging/upload-charging-sessions-using-csv";
import PageName from "@/components/ui/commons/PageName";
import ChargingList from "@/components/ui/componenets/ChargingListComponent";
import { Box, Button, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchChargingSessions = async () => {
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

  useEffect(() => {
    fetchChargingSessions();
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

      const result = await uploadChargingSessionsFromCSV(formData);

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      window.alert(`Upload successful: ${result.message}`);

      // Rerun getChargingSessions to fetch updated data
      await fetchChargingSessions();

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

  return (
    <div>
      <PageName
        name="Charging Sessions"
        breadcrumbs={[
          { name: "Home", href: "/home" },
          { name: "Charging Sessions", href: "/home/chargingSessions" },
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
        <div className="max-h-screen overflow-y-auto p-4">
          <ChargingList loading={isLoading} chargingSessions={chargingSessions} />
        </div>
      </div>
    </div>
  );
};

export default ChargingSessionsPage;
