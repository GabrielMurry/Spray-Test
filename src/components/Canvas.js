import React, { useRef, useEffect } from "react";

const Canvas = ({ image, apply }) => {
  const imageRef = useRef(null);
  const drawRef = useRef(null);

  function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

    return { width: srcWidth * ratio, height: srcHeight * ratio };
  }

  useEffect(() => {
    // image
    const imageCanvas = imageRef.current;
    const imageCtx = imageCanvas.getContext("2d");
    const newImage = new Image();
    newImage.src = URL.createObjectURL(image);

    // canvas
    const drawCanvas = drawRef.current;
    const drawCtx = drawCanvas.getContext("2d");

    newImage.onload = () => {
      // calculate smaller but proportional aspect ratio if image is too large
      const aspectRatio = calculateAspectRatioFit(
        newImage.width,
        newImage.height,
        500,
        500
      );
      // apply new aspect ratio width and height to drawingCanvas, imageCanvas, and the image itself
      drawCanvas.width = aspectRatio.width;
      drawCanvas.height = aspectRatio.height;
      imageCanvas.width = aspectRatio.width;
      imageCanvas.height = aspectRatio.height;
      imageCtx.drawImage(newImage, 0, 0, aspectRatio.width, aspectRatio.height);
    };

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    function draw(e) {
      if (!isDrawing) return;
      drawCtx.beginPath();
      drawCtx.lineWidth = 30;
      drawCtx.strokeStyle = "rgb(255, 255, 255, 0.1)";
      drawCtx.moveTo(lastX, lastY);
      drawCtx.lineTo(e.offsetX, e.offsetY);
      drawCtx.stroke();

      drawCtx.fillStyle = "rgb(255, 255, 255, 0.1)";
      drawCtx.beginPath();
      drawCtx.arc(lastX, lastY, 30, 0, 2 * Math.PI);
      drawCtx.fill();
      lastX = e.offsetX;
      lastY = e.offsetY;
    }

    drawCanvas.addEventListener("mousedown", (e) => {
      isDrawing = true;
      lastX = e.offsetX;
      lastY = e.offsetY;
    });

    drawCanvas.addEventListener("mousemove", draw);
    drawCanvas.addEventListener("mouseup", () => (isDrawing = false));

    drawCanvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      isDrawing = true;
      lastX = touch.offsetX;
      lastY = touch.offsetY;
    });

    drawCanvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      draw({ offsetX: touch.offsetX, offsetY: touch.offsetY });
    });

    drawCanvas.addEventListener("touchend", () => (isDrawing = false));
  }, [image]);

  // apply changes
  useEffect(() => {
    if (apply) {
      // image canvas context
      const imageCanvas = imageRef.current;
      const imageCtx = imageCanvas.getContext("2d");
      // Get the data of the image
      const scannedImage = imageCtx.getImageData(
        0,
        0,
        imageCanvas.width,
        imageCanvas.height
      );
      const scannedImageData = scannedImage.data;

      // drawing canvas context
      const drawCanvas = drawRef.current;
      const drawCtx = drawCanvas.getContext("2d");
      // Get the image data of the canvas
      const scannedCanvas = drawCtx.getImageData(
        0,
        0,
        drawCanvas.width,
        drawCanvas.height
      );
      const scannedCanvasData = scannedCanvas.data;

      // every four elements in data array account for rgb value: rgb(0, 1, 2, 3). Alpha/opacity level is scaled 0 - 255
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
      drawCtx.putImageData(scannedCanvas, 0, 0);
    }
  }, [apply]);

  return (
    <div>
      <canvas
        ref={drawRef}
        style={{ border: "1px solid black" }}
        className="absolute"
      />
      <canvas ref={imageRef} />
    </div>
  );
};

export default Canvas;
