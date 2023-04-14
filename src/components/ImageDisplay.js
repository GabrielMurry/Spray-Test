import React from "react";

const ImageDisplay = ({ dimensions, setDimensions, image }) => {
  const onImgLoad = (e) => {
    if (
      e.target.offsetWidth === dimensions.width &&
      e.target.offsetHeight === dimensions.height
    ) {
      return;
    }
    setDimensions((prev) => ({
      ...prev,
      width: e.target.offsetWidth,
      height: e.target.offsetHeight,
    }));
  };

  return (
    <img
      src={URL.createObjectURL(image)}
      alt="Not Found"
      width={"400px"}
      onLoad={onImgLoad}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
    />
  );
};

export default ImageDisplay;
