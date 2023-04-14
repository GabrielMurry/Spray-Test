import React from "react";

const ImageUpload = ({ image, setImage }) => {
  return (
    <div>
      {image ? (
        <button onClick={() => setImage(null)} className="absolute">
          Remove
        </button>
      ) : (
        <input
          type="file"
          name="myImage"
          onChange={(e) => setImage(e.target.files[0])}
        />
      )}
    </div>
  );
};

export default ImageUpload;
