import { useState } from "react";
import "./App.css";
import Canvas from "./components/Canvas";
import ImageUpload from "./components/ImageUpload";
import Slider from "./components/Slider";
import Colors from "./components/Colors";

function App() {
  const [image, setImage] = useState(null);
  const [apply, setApply] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [brushColor, setBrushColor] = useState("rgb(0, 128, 0)");

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      {image && (
        <>
          <Canvas
            image={image}
            apply={apply}
            brushSize={brushSize}
            brushColor={brushColor}
          />
          <Slider brushSize={brushSize} setBrushSize={setBrushSize} />
          <Colors setBrushColor={setBrushColor} />
        </>
      )}
      <ImageUpload image={image} setImage={setImage} setApply={setApply} />
    </div>
  );
}

export default App;
