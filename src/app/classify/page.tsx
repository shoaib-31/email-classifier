"use client";
import { useRecoilState, useRecoilValue } from "recoil";
import { getUserFromCookies, userAtom } from "../../atoms/userAtom";
import { openAIKeyAtom } from "../../atoms/openAIKeyAtom";
import OpenAIKeyInput from "../../components/OpenAIKeyInput";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { cookies } from "next/headers";
import axios from "axios";
import { Slide, toast } from "react-toastify";
import EmailList from "@/components/EmailList";
const Classify = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [apiKey, setApiKey] = useRecoilState(openAIKeyAtom);

  useEffect(() => {
    const storedApiKey = localStorage.getItem("openAIKey");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
    const user = getUserFromCookies();
    if (user) {
      setUser(user);
    }
  }, [setApiKey, setUser]);
  const router = useRouter();
  const handleLogout = async () => {
    await axios.get("/api/auth/logout");
    setUser(null);
    localStorage.removeItem("user");
    setApiKey("");
    localStorage.removeItem("openAIKey");
    router.push("/");
    toast.success("Logged out successfully", {
      position: "bottom-right",
      autoClose: 4000,
      closeOnClick: true,
      draggable: true,
      pauseOnHover: false,
      progress: undefined,
      theme: "light",
      transition: Slide,
    });
  };
  return (
    <div className=" w-screen min-h-screen overflow-x-hidden flex items-center flex-col gap-8 text-black bg-white mx-auto p-8">
      <div className=" w-4/5 xl:w-3/5  flex items-center gap-4 p-4 bg-gray-200/50 rounded-2xl">
        <img src={user?.picture} alt={user?.name} className="rounded-full" />
        <div className=" flex-1">
          <h1 className="text-2xl font-bold">{user?.name}</h1>
          <p>Email: {user?.email}</p>
        </div>
        <div className=" flex justify-center items-center">
          <button
            onClick={handleLogout}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition"
          >
            Logout
          </button>
        </div>
      </div>

      <EmailList />
    </div>
  );
};

export default Classify;
