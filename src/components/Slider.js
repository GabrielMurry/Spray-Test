import React from "react";

const Slider = ({ brushSize, setBrushSize }) => {
  const handleChange = (e) => {
    e.preventDefault();
    setBrushSize(e.target.value);
  };

  return (
    <div className="flex">
      <input
        type="range"
        min={1}
        max={50}
        value={brushSize}
        onChange={handleChange}
      />
      <div
        className="bg-black rounded-full"
        style={{ width: `${brushSize}px`, height: `${brushSize}px` }}
      ></div>
    </div>
  );
};

export default Slider;
