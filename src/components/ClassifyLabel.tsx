import React from "react";

const ClassifyLabel = ({ classification }: { classification: string }) => {
  return (
    <div
      className={
        "p-2 capitalize text-white text-sm sm:text-base px-2 sm:px-4 rounded-lg font-medium " +
        (classification === "spam"
          ? "bg-red-500"
          : classification === "important"
          ? "bg-green-500"
          : classification === "promotion"
          ? "bg-yellow-500"
          : classification === "social"
          ? "bg-blue-500"
          : "bg-gray-500")
      }
    >
      {classification}
    </div>
  );
};

export default ClassifyLabel;
