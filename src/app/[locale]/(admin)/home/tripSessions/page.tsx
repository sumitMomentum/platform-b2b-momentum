"use client";
import { useState, useEffect, useRef } from "react";
import { getTripSessions } from "@/actions/admin/tripModule/getAllTripSessions";
import PageName from "@/components/ui/commons/PageName";
import TripList from "@/components/ui/componenets/TripListComponent";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PublishIcon from "@mui/icons-material/Publish";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { uploadTripsFromCSV } from "@/actions/admin/csvModule/trip/upload-trip-using-csv";

interface TripSession {
  id: number;
  TripID: number;
  DteStart: number;
  DteEnd: number;
  BatteryAtStart: number;
  BatteryAtEnd: number;
  DwUpdated: string;
  TripApprovedKilometer: number;
  DiffInBat: number;
  DiffInDte: number;
  createdAt: string;
  updatedAt: string;
  vehicleReference: string;
  vehicleId: string | null;
}

const Page = () => {
  const [tripSessions, setTripSessions] = useState<TripSession[]>([]);
  const [error, setError] = useState<string | null>(null); // Error state for better UX
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);

  const fetchTripSessions = async () => {
    try {
      const data = await getTripSessions();

      if (!data || !data.sessions) {
        console.error("[CLIENT] No sessions data received from server");
        setError("No trip sessions available");
        return;
      }

      setTripSessions(data.sessions);
    } catch (error: any) {
      console.error("[CLIENT] Error details:", {
        message: error.message,
        stack: error.stack,
      });
      setError("Failed to load trip sessions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripSessions();
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

      const result = await uploadTripsFromCSV(formData);

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      window.alert(`Upload successful: ${result.message}`);

      // Rerun getTripSessions to fetch updated data
      fetchTripSessions();
    } catch (error) {
      console.error("Upload error:", error);
      window.alert(
        `Error: ${
          error instanceof Error ? error.message : "Something went wrong"
        }`
      );
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
        name={"Trip Sessions"}
        breadcrumbs={[{ name: "Home", href: "/home" }]}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          margin: 2,
        }}
      >
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
                  <Tooltip
                    title={selectedFile ? "Change File" : "Browse"}
                    placement="bottom"
                    color="primary"
                  >
                    <IconButton
                      color="primary"
                      onClick={handleButtonClick}
                      size="small"
                    >
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
        <Button
          startIcon={<FileUploadIcon />}
          variant="contained"
          color="primary"
          onClick={handleUpload}
        >
          Upload
        </Button>
      </Box>
      <div className="container">
        <div className="max-h-screen overflow-y-auto p-4">
          {error ? (
            <div>{error}</div> // Show error message if there is one
          ) : (
            <TripList tripSessions={tripSessions} loading={loading} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
