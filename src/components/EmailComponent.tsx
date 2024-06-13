import React from "react";
import { Parser } from "html-to-react";
import { Poppins } from "next/font/google";
import ClassifyLabel from "./ClassifyLabel";
type EmailComponentProps = {
  id: string;
  body: string;
  senderEmail: string;
  senderName: string;
  subject: string;
  classification?: string;
  onClick: () => void;
};

const poppins = Poppins({
  weight: ["400"],
  subsets: ["latin"],
});
const EmailComponent = ({
  id,
  body,
  senderEmail,
  senderName,
  subject,
  classification,
  onClick,
}: EmailComponentProps) => {
  const htmlParser = new (Parser as any)();

  return (
    <div
      key={"email-" + id}
      onClick={onClick}
      className=" w-full md:w-4/5 xl:w-3/5 bg-gray-200/50 transition hover:bg-gray-200/90 cursor-pointer border-[1px] border-gray-300 flex flex-col p-1.5 sm:p-4 rounded-lg"
    >
      <h1 className="text-lg sm:text-xl md:text-2xl my-2 font-semibold">
        {senderName}
      </h1>
      <p className="text-xs sm:text-base flex text-gray-600 w-fit">
        <span className=" font-medium">From :&nbsp;</span> {senderEmail}
      </p>
      <div className=" w-full flex justify-between items-center">
        <p className="text-xs sm:text-base flex w-4/5 text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
          <span className=" font-medium">Subject: &nbsp; </span>
          <span className="whitespace-nowrap overflow-hidden text-ellipsis">
            {subject}
          </span>
        </p>
        {classification && <ClassifyLabel classification={classification} />}
      </div>
      <div
        className={" my-2 text-xs sm:text-sm line-clamp-1 " + poppins.className}
      >
        {htmlParser.parse(body)}
      </div>
    </div>
  );
};

export default EmailComponent;
