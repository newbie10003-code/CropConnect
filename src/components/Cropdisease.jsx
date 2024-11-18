import React, { useState } from "react";

const CropDisease = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDelete = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedImage) {
      alert("Please upload an image!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await fetch("http://127.0.0.1:5001/crop-disease-predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setPrediction(data.prediction);
      } else {
        alert(data.error || "An error occurred during prediction.");
      }
    } catch (error) {
      alert("Failed to connect to the prediction server.");
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
              <button
                type="button"
                onClick={handleDelete}
                className="drop-close"
              >
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
        <button
          type="submit"
          disabled={loading}
          className="drop-btn"
        >
          {loading ? "Predicting..." : "Submit"}
        </button>
      </form>
      {prediction && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <h3>Prediction Result:</h3>
          <p>{prediction}</p>
        </div>
      )}
    </div>
  );
};

export default CropDisease;
