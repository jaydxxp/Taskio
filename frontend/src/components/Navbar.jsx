import { Link } from "react-router";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between bg-white/60 rounded-full px-5 py-2 shadow-md m-4 mx-auto w-[90%] md:w-[80%] lg:w-[70%] backdrop-blur-md">

<div className="flex items-center space-x-2">
  <Link to="/" className="flex items-center space-x-2">
    <img
      src="./logo.svg"
      alt="Taskio Logo"
      width="36"
      height="36"
      className="rounded-full bg-white p-0.5"
    />
    <span className="text-xl font-semibold tracking-wide text-black">
      Taskio
    </span>
  </Link>
</div>


  
      <div className="flex items-center space-x-4">
        <Link to={"/about"}>
        <button className="text-black px-3 py-1 rounded-full hover:bg-purple-100 transition text-sm cursor-pointer">
          About
        </button>
        </Link>
        <Link to={"/login"}>
        <button className="text-black px-3 py-1 rounded-full hover:bg-purple-100 transition text-sm cursor-pointer">
          Login
        </button>
        </Link>
        <Link to={"/signup"}>
        <button className="bg-white text-purple-700 px-3 py-1 rounded-full font-medium hover:bg-purple-100 transition text-sm cursor-pointer">
          Signup
        </button>
        </Link>
      </div>
    </div>
  );
}
