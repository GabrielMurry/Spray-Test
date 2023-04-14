import { useEffect } from "react";
import { useRef } from "react";

export function useOnDraw(onDraw) {
  // persist that reference to canvas (without triggering a rerun)
  const canvasRef = useRef(null);
  // reference to the point when the mouse move listener was called the previous time
  const prevPointRef = useRef(null);
  // this drawingRef should be true when user holds down mouse button
  const isDrawingRef = useRef(false);

  const mouseMoveListenerRef = useRef(null);
  const mouseUpListenerRef = useRef(null);

  useEffect(() => {
    function initMouseMoveListener() {
      const mouseMoveListener = (e) => {
        // if user is holding down mouse button, then we draw
        if (isDrawingRef.current) {
          // need point (coordinates) of x and y RELATIVE to top left corner of canvas component
          const point = computePointInCanvas(e.clientX, e.clientY);
          // need to use that point to draw something at that point! Gotta get the 2d context
          const ctx = canvasRef.current.getContext("2d");
          // if onDraw is set, then we call that onDraw function. Then component that uses this hook can decide what to do with this context at that point!
          if (onDraw) onDraw(ctx, point, prevPointRef.current);
          prevPointRef.current = point;
        }
      };
      mouseMoveListenerRef.current = mouseMoveListener;
      window.addEventListener("mousemove", mouseMoveListener);
    }

    function initMouseUpListener() {
      const listener = () => {
        isDrawingRef.current = false;
        prevPointRef.current = null;
      };
      mouseUpListenerRef.current = listener;
      window.addEventListener("mouseup", listener);
    }

    // clientX and clientY coordinates should be 0,0 in top left corner of canvas, rather than the entire window/screen itself
    function computePointInCanvas(clientX, clientY) {
      if (!canvasRef.current) return null;
      // need to get bounding box of the canvas component
      const boundingRect = canvasRef.current.getBoundingClientRect();
      return {
        x: clientX - boundingRect.left,
        y: clientY - boundingRect.top,
      };
    }

    function removeListeners() {
      if (mouseMoveListenerRef.current) {
        window.removeEventListener("mousemove", mouseMoveListenerRef.current);
      }
      if (mouseUpListenerRef.current) {
        window.removeEventListener("mouseup", mouseUpListenerRef.current);
      }
    }

    initMouseMoveListener();
    initMouseUpListener();

    return () => {
      // Clean up!
      removeListeners();
    };
  }, [onDraw]);

  function setCanvasRef(ref) {
    canvasRef.current = ref;
  }

  function onMouseDown() {
    isDrawingRef.current = true;
  }

  return {
    setCanvasRef,
    onMouseDown,
  };
}
