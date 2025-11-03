# TaskIO - Task Management System

A modern, full-stack task management application built with React and Node.js, featuring drag-and-drop functionality, priority-based organization, and real-time notifications.

## 🚀 Features

### Core Functionality
- **Task Management**: Create, update, and delete tasks with ease
- **Task Organization**: Organize tasks into three sections - To Do, In Progress, and Done
- **Drag & Drop**: Seamlessly move tasks between sections with intuitive drag-and-drop
- **Priority System**: Categorize tasks by priority levels for better organization
- **Due Date Management**: Set and track due dates for all your tasks

### Advanced Features
- **Filtering**: Filter tasks by priority and due date
- **Subtasks**: Add subtasks to main tasks for better task breakdown
- **Customizable Descriptions**: Rich task descriptions for detailed information
- **Due Date Reminders**: Notification bell system for task reminders
- **User Authentication**: Secure JWT-based authentication system
- **Persistent Storage**: Redux state management with local storage persistence

## 🛠️ Tech Stack

### Frontend
- **React** with **Vite** - Fast and modern development experience
- **Redux Toolkit** - State management
- **Tailwind CSS** - Utility-first styling
- **React DnD** / **DnD Kit** - Drag and drop functionality

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before running this project, make sure you have:
- Node.js (v14 or higher)
- MongoDB installed and running
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/taskio.git
   cd taskio
   ```

2. **Install dependencies for both frontend and backend**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the application**

   ```bash
   # Start backend server
   cd backend
   npm run dev

   # In a new terminal, start frontend
   cd frontend
   npm run dev
   ```

5. **Access the application**
   
   Open your browser and navigate to `http://localhost:5173`

## 🎯 Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Create Tasks**: Click "Add Task" to create a new task with priority, category, and due date
3. **Organize**: Drag and drop tasks between To Do, In Progress, and Done sections
4. **Manage**: Update task details, add subtasks, or delete completed tasks
5. **Filter**: Use priority and due date filters to find specific tasks
6. **Stay Updated**: Check the notification bell for due date reminders

## 🔐 Authentication

TaskIO uses JWT (JSON Web Tokens) for secure authentication. Tokens are stored in local storage and automatically attached to API requests.

## 💾 State Management

Redux Toolkit is used for centralized state management with persistence to local storage, ensuring your tasks are saved even after closing the browser.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Thanks to all contributors who help improve TaskIO
- Built with modern web technologies and best practices

---

**Made with ❤️ using React, Node.js, and MongoDB**