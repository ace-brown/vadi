import React from "react";

import "./LoadingSpinner.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LoadingSpinner = (props: { asOverlay: any }) => {
  return (
    <div className={`${props.asOverlay && "loading-spinner__overlay"}`}>
      <div className="lds-dual-ring"></div>
    </div>
  );
};

export default LoadingSpinner;
