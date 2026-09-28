// Concepts:
// <input type="file"> and e.target.files[0]
// File API (file.name, file.type, file.size)
// URL.createObjectURL() for an image preview
// useEffect cleanup (URL.revokeObjectURL)
// Conditional Rendering

import { useEffect, useState } from "react";
import "./FileUpload.css";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp", "application/pdf"];
const MAX_SIZE_MB = 2;

function FileUpload() {
  // 1. State
  const [file, setFile] = useState(null); // the chosen File object
  const [previewUrl, setPreviewUrl] = useState(""); // temporary URL for <img>, only for images
  const [error, setError] = useState("");

  // 2. Event handlers
  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    // Clear the input so choosing the same file again still fires onChange
    e.target.value = "";

    if (!selectedFile) return; // the user closed the file picker

    // `accept` only filters the picker, so we still check the type ourselves
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError("Only PNG, JPG, GIF, WEBP images or PDF files are allowed.");
      return;
    }

    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File is too big. The maximum size is ${MAX_SIZE_MB} MB.`);
      return;
    }

    setError("");
    setFile(selectedFile);
    // createObjectURL gives a temporary "blob:" URL that points to the file in memory
    setPreviewUrl(selectedFile.type.startsWith("image/") ? URL.createObjectURL(selectedFile) : "");
  }

  function removeFile() {
    setFile(null);
    setPreviewUrl("");
    setError("");
  }

  // 3. Main logic
  // Free the old preview URL when it changes or when the component unmounts (avoids a memory leak)
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const fileSizeKB = file ? (file.size / 1024).toFixed(1) : 0;

  // 4. JSX
  return (
    <div className="upload">
      {/* Clicking a <label> opens its hidden file input */}
      <label className="upload-button">
        {file ? "Change file" : "Choose file"}
        <input type="file" accept={ALLOWED_TYPES.join(",")} onChange={handleFileChange} hidden />
      </label>
      <p className="upload-hint">PNG, JPG, GIF, WEBP or PDF · max {MAX_SIZE_MB} MB</p>

      {error && <p className="upload-error">{error}</p>}

      {file ? (
        <div className="upload-card">
          <p className="upload-name">{file.name}</p>
          <p className="upload-meta">
            {file.type} · {fileSizeKB} KB
          </p>

          {previewUrl ? (
            <img className="upload-preview" src={previewUrl} alt={`Preview of ${file.name}`} />
          ) : (
            <p className="upload-meta">📄 No preview for PDF files.</p>
          )}

          <button onClick={removeFile}>Remove</button>
        </div>
      ) : (
        <p className="upload-meta">No file selected.</p>
      )}
    </div>
  );
}

export default FileUpload;
