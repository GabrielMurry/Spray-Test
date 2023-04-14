import { useState } from "react";
import "./App.css";
import Canvas from "./components/Canvas";
import ImageDisplay from "./components/ImageDisplay";
import ImageUpload from "./components/ImageUpload";

function App() {
  const [image, setImage] = useState(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      {image && (
        <>
          <ImageDisplay
            dimensions={dimensions}
            setDimensions={setDimensions}
            image={image}
          />
          <Canvas dimensions={dimensions} />
        </>
      )}
      <ImageUpload image={image} setImage={setImage} />
    </div>
  );
}

export default App;
