import React, { useState } from "react";

const CropDisease = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(""); 

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file);
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      console.log("Dropped file:", file);
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDelete = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedImage) {
      setError("Please upload an image!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await fetch("https://cropconnect-48a7.onrender.com/crop-disease", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "An error occurred during prediction.");
        return;
      }

      const result = await response.json();
      setPrediction(result.prediction);
      setDownloadUrl(result.download_url);
      setError("");
    } catch (error) {
      setError("Failed to connect to the prediction server.");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cropD">
      <form onSubmit={handleSubmit} style={{ textAlign: "center", width: "90%" }}>
        <div
          className="drop-box"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById("file-upload").click()}
        >
          <div>
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Selected"
                  style={{ maxWidth: "100%", height: "26vw" }}
                />
                <button type="button" onClick={handleDelete} className="drop-close">
                  X
                </button>
              </>
            ) : (
              <>
                <p>Crop Disease Prediction</p>
                <h4>Drag & drop or click to upload an image</h4>
              </>
            )}
          </div>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
        <button type="submit" disabled={loading} className="drop-btn">
          {loading ? "Predicting..." : "Submit"}
        </button>
      </form>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {prediction && !error && (
        <div className="prediction">
          <h3>Prediction: {prediction}</h3>
          {downloadUrl ? (
            <a href={downloadUrl} download className="download-btn">
              Download Report
            </a>
          ) : (
            <p>Generating report, please wait...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CropDisease;
