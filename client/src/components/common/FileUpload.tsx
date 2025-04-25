import React, { useState } from "react";

export default function FileUpload() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Convert the FileList to an array and add to the current state
    const selectedFiles = event.target.files
      ? Array.from(event.target.files)
      : [];
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  return (
    <div className="file-upload">
      <label
        htmlFor="file-upload-input"
        className="cursor-pointer text-blue-500 font-medium hover:underline"
      >
        آپلود فایل
      </label>
      <input
        id="file-upload-input"
        type="file"
        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.mp4,.avi"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
      {files.length > 0 && (
        <div className="mt-2">
          <p>فایل‌های انتخاب‌شده:</p>
          <ul>
            {files.map((file, index) => (
              <li key={index} className="text-sm text-gray-600">
                {file.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
