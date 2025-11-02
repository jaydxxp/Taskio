export default function Sidebar() {
  return (
    <div className="relative flex flex-col justify-between h-screen w-[340px] bg-white px-5 py-5 shadow-sm">
 
      <div>
  
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8  rounded-lg flex items-center justify-center">
              <img src="./logo.svg"/>
            </div>
            <span className="text-lg font-bold text-gray-900">Taskio</span>
          </div>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

    
        <nav className="flex flex-col space-y-0.5 text-gray-600 font-medium mb-5">
          <div className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition">
            <img src="./home.svg" alt="Home" className="w-5 h-5" />
            <span>Home</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition">
            <img src="./message.svg" alt="Messages" className="w-5 h-5" />
            <span>Messages</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition">
            <img src="./tasks.svg" alt="Tasks" className="w-5 h-5" />
            <span>Tasks</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition">
            <img src="./users.svg" alt="Members" className="w-5 h-5" />
            <span>Members</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition">
            <img src="./setting-2.svg" alt="Settings" className="w-5 h-5" />
            <span>Settings</span>
          </div>
        </nav>

 
        <div className="w-full h-px bg-gray-200 my-5"></div>

     
        <div className="flex items-center justify-between mb-3 px-3">
          <span className="text-gray-500 font-semibold text-xs tracking-wider">
            MY PROJECTS
          </span>
          <button className="p-1 hover:bg-gray-100 rounded transition">
            <img src="./add-square.svg" alt="Add" className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col space-y-0.5">
          <div className="flex items-center gap-3 px-3 py-2 bg-purple-50 rounded-lg cursor-pointer">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-gray-900 text-sm font-semibold flex-1">Mobile App</span>
            <p className="text-gray-500 text-lg font-bold cursor-pointer">...</p>
          </div>

          <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <span className="text-gray-600 text-sm font-medium">
              Website Redesign
            </span>
          </div>

          <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition">
            <div className="w-2 h-2 rounded-full bg-purple-300"></div>
            <span className="text-gray-600 text-sm font-medium">
              Design System
            </span>
          </div>

          <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <span className="text-gray-600 text-sm font-medium">Wireframes</span>
          </div>
        </div>
      </div>

<div className="relative mt-8">
      
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-50 rounded-full p-6">
          <div className="absolute inset-0 bg-linear-to-br from-yellow-300 via-yellow-200 to-transparent rounded-full blur-md opacity-25"></div>
          <img src="./lamp-on.svg" alt="Idea" className="w-7 h-7 relative z-10" />
        </div>

        
        <div className="bg-gray-50 rounded-3xl px-5 pt-10 pb-5 text-center">
          <h4 className="font-bold text-gray-900 text-sm mb-2">
            Thoughts Time
          </h4>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            We don't have any notice for you, till then you can share your thoughts with your peers.
          </p>
          <button className="bg-white text-gray-900 rounded-lg text-sm px-4 py-2 font-semibold hover:bg-gray-100 transition shadow-sm w-full">
            Write a message
          </button>
        </div>
      </div>
    </div>
  );
}