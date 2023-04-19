import React from "react";

const ImageUpload = ({ image, setImage, setApply }) => {
  return (
    <div className="w-full flex justify-center">
      {image ? (
        <div className="w-[20rem] absolute">
          <div className="flex justify-evenly">
            <button onClick={() => setImage(null)}>Remove</button>
            <button onClick={() => setApply(true)}>Apply</button>
          </div>
        </div>
      ) : (
        <input
          type="file"
          name="myImage"
          onChange={(e) => {
            setImage(e.target.files[0]);
          }}
        />
      )}
    </div>
  );
};

export default ImageUpload;
