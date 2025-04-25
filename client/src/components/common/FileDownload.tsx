import React from "react";

// Define the mapping of file extensions to MIME types
const mimeTypes: { [key: string]: string } = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  mp4: "video/mp4",
  mov: "video/quicktime",
  mkv: "video/x-matroska",
};

interface FileDownloadProps {
  fileUrl: string;
  fileName: string;
}

export default function FileDownload({ fileUrl, fileName }: FileDownloadProps) {
  const getMimeType = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    return ext
      ? mimeTypes[ext] || "application/octet-stream"
      : "application/octet-stream";
  };

  const handleDownload = async () => {
    try {
      // Trigger file download by making a GET request to the download URL
      const response = await fetch(fileUrl, {
        method: "GET",
        headers: {
          "Content-Type": getMimeType(fileName),
        },
      });

      if (response.ok) {
        // Create a link element to simulate the file download
        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = fileName; // File name for download
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl); // Clean up
      } else {
        console.error("File download failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="text-blue-500 font-medium hover:underline"
    >
      دانلود {fileName}
    </button>
  );
}
