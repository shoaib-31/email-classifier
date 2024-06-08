"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import EmailLoader from "./EmailLoader";
import { Parser } from "html-to-react";
import ClassifyLabel from "./ClassifyLabel";

interface FullEmailViewerProps {
  emailId: string;
  classification?: string;
}

const FullEmailViewer: React.FC<FullEmailViewerProps> = ({
  emailId,
  classification,
}) => {
  const [email, setEmail] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEmail(null);
    const fetchEmail = async () => {
      try {
        const response = await axios.get(`/api/email/${emailId}`);
        setEmail(response.data);
      } catch (error) {
        setError("Error fetching email");
        console.error(error);
      }
    };

    fetchEmail();
  }, [emailId]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!email) {
    return (
      <p className=" w-full h-screen flex justify-center items-center">
        <EmailLoader />
      </p>
    );
  }
  const htmlParser = new (Parser as any)();

  return (
    <div className="  overflow-scroll h-screen flex flex-col gap-2 p-8">
      {classification && (
        <div className=" w-full flex items-center gap-2">
          Category:
          <ClassifyLabel classification={classification} />
        </div>
      )}
      {!email.htmlContent && (
        <p className=" p-8 bg-gray-200/50 rounded-xl">
          {htmlParser.parse(email.snippet)}
        </p>
      )}
      {email.htmlContent && (
        <div dangerouslySetInnerHTML={{ __html: email.htmlContent }} />
      )}
    </div>
  );
};

export default FullEmailViewer;
