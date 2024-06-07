import LoginWithGoogle from "@/app/components/LoginWithGoogle";
import Link from "next/link";

const Home = () => {
  return (
    <div className=" w-screen h-screen bg-white text-black flex justify-center items-center flex-col gap-10">
      <h1 className="text-4xl font-semibold">Welcome to Email Classifier</h1>
      <LoginWithGoogle />
    </div>
  );
};

export default Home;
