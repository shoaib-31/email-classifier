import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import EmailComponent from "./EmailComponent";
import Loader from "./Loader";
import ClassifyButton from "./ClassifyButton";
import FullEmailViewer from "./FullEmailViewer";
import SidebarCloseButton from "./SidebarCloseButton";
import APIKeyInput from "./APIKeyInput";

const EmailList = () => {
  const emailCounts = [5, 10, 15, 20, 25];
  const [emailCount, setEmailCount] = useState(emailCounts[0]);
  const [emails, setEmails] = useState([] as any[]);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [classification, setClassification] = useState([] as string[]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLastEmails();
    setClassification([]);
  }, [emailCount]);

  if (localStorage.getItem("geminiAPIKey") === null) {
    return <APIKeyInput />;
  }
  async function fetchLastEmails() {
    setLoading(true);
    try {
      const emails = await axios.post("/api/fetch-emails", {
        emailCount: emailCount,
      });
      setEmails(emails.data.messages);
    } catch (e) {
      toast.error("Error fetching emails");
    } finally {
      setLoading(false);
    }
  }

  const handleEmailClick = (emailId: string) => {
    setSelectedEmailId(emailId);
  };

  const handleCloseSidebar = () => {
    setSelectedEmailId(null);
  };

  const index = emails?.findIndex((email) => email.id === selectedEmailId);
  const emailClassification = index !== -1 ? classification[index] : "";

  return (
    <div className="w-full flex-1 py-4 flex items-center flex-col">
      <div className="flex w-3/5 mb-4 items-center justify-between">
        <div className="flex gap-2 items-center">
          <label htmlFor="count" className="text-xl font-medium text-gray-900">
            Select Number of Emails:
          </label>
          <select
            id="count"
            defaultValue={emailCount}
            onChange={(e) => setEmailCount(Number(e.target.value))}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-fit p-1.5"
          >
            {emailCounts.map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </div>
        <ClassifyButton emails={emails} setClassification={setClassification} />
      </div>
      {loading ? (
        <div className="w-full h-full flex flex-1 items-center justify-center">
          <Loader text="Fetching Emails..." />
        </div>
      ) : (
        <div className="w-full flex items-center flex-col gap-4">
          {emails?.map((email, index) => (
            <EmailComponent
              key={email.id}
              id={email.id}
              body={email.body}
              onClick={() => handleEmailClick(email.id)}
              senderEmail={email.senderEmail}
              senderName={email.senderName}
              subject={email.subject}
              classification={
                classification.length > 0 ? classification[index] : ""
              }
            />
          ))}
        </div>
      )}
      <AnimatePresence>
        {selectedEmailId && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 w-full md:w-1/3 h-full bg-white shadow-lg"
          >
            <SidebarCloseButton onClose={handleCloseSidebar} />
            <FullEmailViewer
              emailId={selectedEmailId}
              classification={emailClassification}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmailList;
