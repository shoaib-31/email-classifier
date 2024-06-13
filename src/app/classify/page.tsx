"use client";
import { useRecoilState, useRecoilValue } from "recoil";
import { getUserFromCookies, userAtom } from "../../atoms/userAtom";
import { openAIKeyAtom } from "../../atoms/openAIKeyAtom";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import dynamic from "next/dynamic";
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
    await axios.post("/api/auth/logout");
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
    localStorage.removeItem("geminiAPIKey");
    setApiKey("");
    setUser(null);
    window.location.href = "/";
  };
  const getAvatarFallback = (name: string) => {
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("");
  };
  return (
    <div className=" w-screen relative min-h-screen overflow-x-hidden flex items-center flex-col gap-8 text-black bg-white mx-auto p-4 sm:p-8">
      <div className=" w-full md:w-4/5 xl:w-3/5  flex items-center flex-wrap gap-4 p-4 bg-gray-200/50 rounded-2xl">
        {user?.picture ? (
          <img
            src={user?.picture}
            alt={user?.name}
            className="rounded-full h-10 sm:h-20 aspect-square"
          />
        ) : user?.name ? (
          <div className="rounded-full bg-gray-500 flex justify-center items-center h-10 sm:h-20 aspect-square">
            {getAvatarFallback(user?.name)}
          </div>
        ) : (
          <div className="rounded-full h-10 sm:h-20 aspect-square animate-pulse bg-gray-200"></div>
        )}
        {user?.name || user?.email ? (
          <div className=" flex-1">
            <h1 className="text-lg sm:text-2xl font-bold">{user?.name}</h1>
            <p className="text-sm sm:text-xl">Email: {user?.email}</p>
          </div>
        ) : (
          <div className="flex-1 ">
            <div className="h-6 animate-pulse bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-4 animate-pulse bg-gray-300 rounded w-1/3"></div>
          </div>
        )}
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

export default dynamic(() => Promise.resolve(Classify), {
  ssr: false,
});
