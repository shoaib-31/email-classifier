import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../atoms/userAtom";
import { openAIKeyAtom } from "../atoms/openAIKeyAtom";
import EmailClassifier from "../components/EmailClassifier";
import OpenAIKeyInput from "../components/OpenAIKeyInput";
import { useEffect } from "react";

const Classify = () => {
  const user = useRecoilValue(userAtom);
  const [apiKey, setApiKey] = useRecoilState(openAIKeyAtom);

  useEffect(() => {
    const storedApiKey = localStorage.getItem("openAIKey");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, [setApiKey]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      <img src={user.picture} alt={user.name} className="rounded-full" />
      <OpenAIKeyInput />
      {apiKey && <EmailClassifier />}
    </div>
  );
};

export default Classify;
