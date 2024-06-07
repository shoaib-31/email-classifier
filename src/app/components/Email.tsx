import { useState } from "react";
import axios from "axios";

const Emails = () => {
  const [emailContents, setEmailContents] = useState([""]);
  const [classifications, setClassifications] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleEmailChange = (index: number, content: string) => {
    const updatedEmails = [...emailContents];
    updatedEmails[index] = content;
    setEmailContents(updatedEmails);
  };

  const addEmailField = () => {
    setEmailContents([...emailContents, ""]);
  };

  const classifyEmails = async () => {
    try {
      setError("");
      const response = await axios.post("/api/classify-email", {
        emailContents,
      });
      setClassifications(response.data.classifications);
    } catch (error) {
      setError("Error classifying emails. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Classify Emails</h1>
      {emailContents.map((emailContent, index) => (
        <div key={index} className="mb-4">
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            rows={4}
            value={emailContent}
            onChange={(e) => handleEmailChange(index, e.target.value)}
            placeholder={`Paste email content ${index + 1} here...`}
          ></textarea>
        </div>
      ))}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        onClick={addEmailField}
      >
        Add Another Email
      </button>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded mt-2 ml-2"
        onClick={classifyEmails}
      >
        Classify Emails
      </button>
      {classifications.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Classifications</h2>
          {classifications.map((classification, index) => (
            <p key={index}>
              Email {index + 1}: <strong>{classification}</strong>
            </p>
          ))}
        </div>
      )}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default Emails;
