import {
  getSignedUploadUrl,
  parseAndStoreCSVData,
} from "@/utils/facades/serverFacades/csvFacade";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

const UploadCSV = () => {
  const [uploadStatus, setUploadStatus] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      const maxSize = 50 * 1024 * 1024; // 50 MB

      if (selectedFile.size <= maxSize) {
        setFile(selectedFile);
      } else {
        toast.error("File size exceeds the limit of 50 MB.");
      }
    } else {
      toast.error("Please select a CSV file.");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [],
    },
  });

  const uploadFile = async () => {
    if (!file) {
      toast.error("Choose a file");
      return;
    }

    setUploadStatus("Uploading...");

    try {
      const uploadURL = await getSignedUploadUrl(file.name, file.type);
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadURL, true);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentCompleted = Math.round(
            (event.loaded * 100) / event.total
          );
          setUploadStatus(`Upload Progress: ${percentCompleted}%`);
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          toast.success("Upload Successful");
          await parseAndStoreCSVData(file.name);
          setUploadStatus("");
          setFile(null);
        } else {
          toast.error("Upload Failed");
          setUploadStatus("");
        }
      };

      xhr.onerror = () => {
        toast.error("Upload failed");
        setUploadStatus("");
      };

      xhr.send(file);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Upload failed");
      setUploadStatus("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mb-2">
      <h1 className="text-2xl font-bold mb-4">Upload Data</h1>
      <div
        {...getRootProps()}
        className={`dropzone border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
          isDragActive ? "border-blue-500" : "border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-500">Drop the file here</p>
        ) : (
          <>
            {!file && (
              <p>Drag &apos;n&apos; drop a CSV file here, or click to select</p>
            )}
            {file && (
              <p className="text-gray-500">Selected File: {file.name}</p>
            )}
          </>
        )}
      </div>
      <button
        onClick={uploadFile}
        disabled={!file}
        className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Upload
      </button>
      <p>{uploadStatus}</p>
    </div>
  );
};

export default UploadCSV;
