import React, { useState, useRef, useEffect } from "react";

interface IViewerProps {}

const ImageViewer: React.FC<IViewerProps> = ({}) => {
  const ref = React.createRef<HTMLImageElement>();

  function zoom(e: React.WheelEvent<HTMLImageElement>) {
    console.log(e.deltaY);

    ref.current?.setAttribute("style", "width: 100%;transform: scale(0.5)");
  }

  return (
    <div className="imageViewer">
      <img
        ref={ref}
        src="https://i.pinimg.com/originals/3b/8a/d2/3b8ad2c7b1be2caf24321c852103598a.jpg"
        style={{ width: "100%" }}
        onWheel={zoom}
      />
    </div>
  );
};

export default ImageViewer;
