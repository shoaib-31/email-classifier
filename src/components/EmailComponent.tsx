import React from "react";

type EmailComponentProps = {
  id: string;
  body: string;
  senderEmail: string;
  senderName: string;
  subject: string;
  classification?: string;
};

const EmailComponent = ({
  id,
  body,
  senderEmail,
  senderName,
  subject,
  classification,
}: EmailComponentProps) => {
  return (
    <div
      key={"email-" + id}
      className=" w-full bg-gray-200/50 flex flex-col relative p-4 rounded-lg"
    >
      <h1 className="text-2xl my-2 font-semibold">{senderName}</h1>
      <p className=" flex text-gray-600 w-fit">
        <span className=" font-medium">From :&nbsp;</span> {senderEmail}
      </p>
      <div className=" w-full flex justify-between items-center">
        <p className=" flex w-4/5 text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
          <span className=" font-medium">Subject: &nbsp; </span>
          <span className="whitespace-nowrap overflow-hidden text-ellipsis">
            {subject}
          </span>
        </p>
        {classification && (
          <div
            className={
              "p-2 capitalize text-white px-4 rounded-lg font-medium " +
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
        )}
      </div>
      <p className=" my-2 text-sm line-clamp-2">{body}</p>
    </div>
  );
};

export default EmailComponent;
