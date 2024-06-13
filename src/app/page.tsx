import LoginWithGoogle from "@/components/LoginWithGoogle";

const Home = () => {
  return (
    <div className=" w-screen h-screen bg-white text-black flex justify-center items-center flex-col gap-10">
      <h1 className="text-2xl sm:text-4xl text-center w-full font-semibold">
        Welcome to Email Classifier
      </h1>
      <LoginWithGoogle />
    </div>
  );
};

export default Home;
