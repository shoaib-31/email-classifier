import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { toast } from "react-toastify";
import EmailComponent from "./EmailComponent";
import Loader from "./Loader";

const EmailList = () => {
  const emailCounts = [5, 10, 15, 20, 25];
  const [emailCount, setEmailCount] = useState(emailCounts[0]);
  const [emails, setEmails] = useState([] as any[]);
  const classificationTypes = [
    "spam",
    "important",
    "normal",
    "promotion",
    "social",
  ];
  const [classification, setClassification] = useState([] as string[]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const storedEmails = localStorage.getItem("emails");
    if (storedEmails) {
      setEmails(JSON.parse(storedEmails) || []);
    }
  }, []);
  useEffect(() => {
    fetchLastEmails();
  }, [emailCount]);

  async function fetchLastEmails() {
    setLoading(true);
    try {
      const emails = await axios.post("/api/fetch-emails", {
        emailCount: emailCount,
      });
      setEmails(emails.data.messages);
      localStorage.setItem("emails", JSON.stringify(emails.data.messages));
    } catch (e) {
      toast.error("Error fetching emails");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className=" w-4/5 xl:w-3/5  flex-1 py-4 flex flex-col">
      <div className=" flex w-full mb-4 items-center justify-between">
        <div className=" flex gap-2 items-center">
          <label
            htmlFor="count"
            className=" text-xl font-medium text-gray-900 "
          >
            Select Number of Emails:
          </label>
          <select
            id="count"
            defaultValue={emailCount}
            onChange={(e) => setEmailCount(Number(e.target.value))}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-fit p-1.5 "
          >
            {emailCounts.map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-opacity-80 transition">
          Classify
        </button>
      </div>
      {loading ? (
        <div className=" w-full h-full flex flex-1 items-center justify-center">
          <Loader text="Fetching Emails..." />
        </div>
      ) : (
        <div className=" w-full flex flex-col gap-4">
          {emails.map((email, index) => (
            <EmailComponent
              key={email.id}
              id={email.id}
              body={email.body}
              senderEmail={email.senderEmail}
              senderName={email.senderName}
              subject={email.subject}
              classification={classification[index % classification.length]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EmailList;
