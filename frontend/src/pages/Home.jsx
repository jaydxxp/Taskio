import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-col justify-center items-center grow text-center px-6 mb-30 py-20">
        <h1 className="font-semibold text-4xl md:text-6xl leading-[1.1] text-black mb-2">
          Your All-in-One
          <br />
          <span className="text-violet-500">Task Management Solution</span>
        </h1>

        <p className="max-w-2xl text-base md:text-base text-gray-600 mb-2 font-light">
          Effortless task management for teams and individuals, streamline
          <br />
          workflows, meet deadlines, and achieve more with ease.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mt-2">
          <button className="px-4 py-2 bg-violet-500 text-white rounded-3xl font-medium hover:bg-violet-600 transition duration-300 shadow-sm">
            Get Started
          </button>
          
        </div>
      </div>
    </div>
  );
}
