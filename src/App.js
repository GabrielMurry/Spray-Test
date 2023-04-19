import { useState } from "react";
import "./App.css";
import Canvas from "./components/Canvas";
import ImageUpload from "./components/ImageUpload";
import Slider from "./components/Slider";

function App() {
  const [image, setImage] = useState(null);
  const [apply, setApply] = useState(false);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      {image && (
        <>
          {/* <ImageDisplay
            dimensions={dimensions}
            setDimensions={setDimensions}
            image={image}
          /> */}
          <Canvas image={image} apply={apply} />
          <Slider />
        </>
      )}
      <ImageUpload image={image} setImage={setImage} setApply={setApply} />
    </div>
  );
}

export default App;
