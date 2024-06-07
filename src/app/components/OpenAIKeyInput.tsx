import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { openAIKeyAtom } from "../atoms/openAIKeyAtom";

const OpenAIKeyInput = () => {
  const [key, setKey] = useState("");
  const setApiKey = useSetRecoilState(openAIKeyAtom);

  const handleSaveKey = () => {
    localStorage.setItem("openAIKey", key);
    setApiKey(key);
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold">Enter your OpenAI API Key</h2>
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded mt-2"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Your OpenAI API Key"
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        onClick={handleSaveKey}
      >
        Save Key
      </button>
    </div>
  );
};

export default OpenAIKeyInput;
