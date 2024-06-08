import axios from "axios";
import React from "react";
import { toast } from "react-toastify";

const ClassifyButton = ({ emails, setClassification }: any) => {
  const [loading, setLoading] = React.useState(false);
  const handleClassification = async () => {
    setLoading(true);
    try {
      const messageBodies = emails.map((email: any) => email.body);
      const API_KEY = localStorage.getItem("geminiAPIKey");
      const response = await axios.post("/api/classify-email", {
        messages: messageBodies,
        apiKey: API_KEY,
      });
      setClassification(response.data.classification);
    } catch (error) {
      console.error(error);
      toast.error("Error classifying messages");
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      onClick={handleClassification}
      className="bg-blue-500 text-white px-8 py-2 h-12 rounded-lg mr-2 hover:bg-opacity-80 transition-all"
    >
      {loading ? (
        <div className=" flex gap-1 transition-all justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.0"
            width="28px"
            height="28px"
            viewBox="0 0 128 128"
            xmlSpace="preserve"
          >
            <g>
              <circle cx="16" cy="64" r="16" fill="#ffffff" />
              <circle
                cx="16"
                cy="64"
                r="14.344"
                fill="#ffffff"
                transform="rotate(45 64 64)"
              />
              <circle
                cx="16"
                cy="64"
                r="12.531"
                fill="#ffffff"
                transform="rotate(90 64 64)"
              />
              <circle
                cx="16"
                cy="64"
                r="10.75"
                fill="#ffffff"
                transform="rotate(135 64 64)"
              />
              <circle
                cx="16"
                cy="64"
                r="10.063"
                fill="#ffffff"
                transform="rotate(180 64 64)"
              />
              <circle
                cx="16"
                cy="64"
                r="8.063"
                fill="#ffffff"
                transform="rotate(225 64 64)"
              />
              <circle
                cx="16"
                cy="64"
                r="6.438"
                fill="#ffffff"
                transform="rotate(270 64 64)"
              />
              <circle
                cx="16"
                cy="64"
                r="5.375"
                fill="#ffffff"
                transform="rotate(315 64 64)"
              />
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 64 64;315 64 64;270 64 64;225 64 64;180 64 64;135 64 64;90 64 64;45 64 64"
                calcMode="discrete"
                dur="720ms"
                repeatCount="indefinite"
              ></animateTransform>
            </g>
          </svg>
          Classifying
        </div>
      ) : (
        "Classify"
      )}
    </button>
  );
};

export default ClassifyButton;
