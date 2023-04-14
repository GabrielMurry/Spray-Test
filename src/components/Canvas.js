import React from "react";
import { useOnDraw } from "./Hooks";

const Canvas = ({ dimensions }) => {
  const { onMouseDown, setCanvasRef } = useOnDraw(onDraw);

  function onDraw(ctx, point, prevPoint) {
    drawLine(prevPoint, point, ctx, "#000000", 5);
  }

  function drawLine(start, end, ctx, color, width) {
    start = start ?? end;
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    // Ending of lines are flat not round. We want to avoid this to make it look better - make a circle or dot to our line endings
    // fill color
    ctx.fillStyle = color;
    // we want to draw a path on our canvas. beginPath() tells ctx that we now want to specify a path
    ctx.beginPath();
    // drawing a circle on screen. (x, y, 2px which is radius of our circle, want full circle so we begin at angle of 0 radians, full circle is 2 * value of PI)
    ctx.arc(start.x, start.y, 2, 0, 2 * Math.PI);
    // tell ctx to fill that circle
    ctx.fill();
  }

  return (
    <canvas
      width={dimensions.width}
      height={dimensions.height}
      onMouseDown={onMouseDown}
      style={canvasStyle}
      ref={setCanvasRef}
    />
  );
};

export default Canvas;

const canvasStyle = {
  border: "1px solid black",
};
