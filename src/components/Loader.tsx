import React from "react";

const Loader = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-col  gap-2 items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.0"
        width="64px"
        height="64px"
        viewBox="0 0 128 128"
        xmlSpace="preserve"
      >
        <rect x="0" y="0" width="100%" height="100%" fill="#FFFFFF" />
        <g>
          <path
            d="M75.4 126.63a11.43 11.43 0 0 1-2.1-22.65 40.9 40.9 0 0 0 30.5-30.6 11.4 11.4 0 1 1 22.27 4.87h.02a63.77 63.77 0 0 1-47.8 48.05v-.02a11.38 11.38 0 0 1-2.93.37z"
            fill="#000000"
          />
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 64 64"
            to="360 64 64"
            dur="1000ms"
            repeatCount="indefinite"
          ></animateTransform>
        </g>
      </svg>
      <h1 className=" text-2xl font-medium">{text || "Loading..."}</h1>
    </div>
  );
};

export default Loader;
