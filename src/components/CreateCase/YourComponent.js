import axios from "axios";
import React from "react";

const YourComponent = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
      const response = await axios.post(
        "https://test-strapi.rytt.com/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Add your form fields here */}
      <input type="file" name="files" multiple />
      <button type="submit">Submit</button>
    </form>
  );
};

export default YourComponent;
