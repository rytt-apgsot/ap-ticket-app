import axios from "axios";
import React from "react";

const YourComponent = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(e.target.files);

    const formData = new FormData(e.target);

    console.log(formData);

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

      console.log("Upload successful:", response.data);
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
