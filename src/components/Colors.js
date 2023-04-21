import React from "react";

const Colors = ({ setBrushColor }) => {
  return (
    <div className="flex justify-evenly w-[20rem]">
      <button onClick={() => setBrushColor("rgb(0, 128, 0)")}>Green</button>
      <button onClick={() => setBrushColor("rgb(0, 0, 255)")}>Blue</button>
      <button onClick={() => setBrushColor("rgb(128, 0, 128)")}>Purple</button>
      <button onClick={() => setBrushColor("rgb(255, 0, 0)")}>Red</button>
    </div>
  );
};

export default Colors;
