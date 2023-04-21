import React, { useRef, useEffect, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";

const Canvas = ({ image, apply, brushSize, brushColor }) => {
  const imageRef = useRef(null);
  const drawRef = useRef(null);

  const [dimensions, setDimensions] = useState({ width: null, height: null });

  function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

    return { width: srcWidth * ratio, height: srcHeight * ratio };
  }

  // image and canvas display
  useEffect(() => {
    // drawing canvas
    const drawCanvas = drawRef.current;

    // image
    const imageCanvas = imageRef.current;
    const imageCtx = imageCanvas.getContext("2d");
    const newImage = new Image();
    newImage.src = URL.createObjectURL(image);
    newImage.onload = () => {
      // calculate smaller but proportional aspect ratio if image is too large
      // const aspectRatio = calculateAspectRatioFit(
      //   newImage.width,
      //   newImage.height,
      //   500,
      //   500
      // );
      setDimensions((prev) => ({
        ...prev,
        width: newImage.width,
        height: newImage.height,
      }));
      // apply new aspect ratio width and height to drawingCanvas, imageCanvas, and the image itself
      drawCanvas.width = newImage.width;
      drawCanvas.height = newImage.height;
      imageCanvas.width = newImage.width;
      imageCanvas.height = newImage.height;
      imageCtx.drawImage(newImage, 0, 0, newImage.width, newImage.height);
    };
  }, [image]);

  // apply changes
  useEffect(() => {
    function getDrawCtx() {
      const drawCanvas = document.createElement("canvas");
      drawCanvas.width = dimensions.width;
      drawCanvas.height = dimensions.height;
      return drawCanvas.getContext("2d");
    }

    function getScannedCanvas(drawCtx, newDrawnCanvas) {
      drawCtx.drawImage(
        newDrawnCanvas,
        0,
        0,
        dimensions.width,
        dimensions.height
      );
      return drawCtx.getImageData(0, 0, dimensions.width, dimensions.height);
    }

    function getImageCtx() {
      const imageCanvas = imageRef.current;
      return imageCanvas.getContext("2d");
    }

    function getScannedImage(imageCtx) {
      return imageCtx.getImageData(0, 0, dimensions.width, dimensions.height);
    }

    if (apply) {
      drawRef.current
        .exportImage("png")
        .then((data) => {
          // grab exported drawing canvas png, make it a new canvas element, getImageData, use it to manipulate image
          const drawCtx = getDrawCtx();
          const newDrawnCanvas = new Image();
          newDrawnCanvas.src = data;
          newDrawnCanvas.onload = () => {
            const scannedCanvas = getScannedCanvas(drawCtx, newDrawnCanvas);
            const scannedCanvasData = scannedCanvas.data;

            const imageCtx = getImageCtx();
            const scannedImage = getScannedImage(imageCtx);
            const scannedImageData = scannedImage.data;
            for (let i = 0; i < scannedCanvasData.length; i += 4) {
              const drawnAlpha = scannedCanvasData[i + 3];
              // if we find a pixel where we did NOT draw, then darken the image
              if (drawnAlpha === 0) {
                // making non-drawn parts of image into grayscale
                const total =
                  scannedImageData[i] +
                  scannedImageData[i + 1] +
                  scannedImageData[i + 2];
                const averageColorValue = total / 3;
                const factor = 0.7; // Adjust this to control the amount of darkening
                scannedImageData[i] = averageColorValue * factor;
                scannedImageData[i + 1] = averageColorValue * factor;
                scannedImageData[i + 2] = averageColorValue * factor;
              }
              // if we find a pixel where we DID draw, then make opacity/alpha 0. (erase the color)
              else {
                scannedCanvasData[i + 3] = 0;
              }
            }
            imageCtx.putImageData(scannedImage, 0, 0);
            imageCtx.imageSmoothingQuality = "high";
            drawRef.current.clearCanvas();
          };
          // var binaryData = [];
          // binaryData.push(data);
          // newDrawnCanvas.src = URL.createObjectURL(new Blob(binaryData));
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [apply, image, dimensions]);

  return (
    <div>
      <canvas ref={imageRef} className="absolute" />
      <ReactSketchCanvas
        ref={drawRef}
        style={{ border: "1px solid black" }}
        strokeWidth={brushSize}
        strokeColor="rgb(0, 128, 0, 0.5)"
        className="relative"
        canvasColor="transparent"
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  );
};

export default Canvas;
