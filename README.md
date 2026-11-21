# 📝 What To-Do? — Full-Stack Task Management Application

### Organize. Prioritize. Accomplish.

Turn everyday tasks into organized progress, one task at a time.

**What To-Do?** is a responsive full-stack task management application designed to help users organize their daily activities, keep track of deadlines, and manage task completion through a simple and intuitive interface.

Built with **React 19** and powered by **Vite**, the application combines essential task management functionality with a bold Neobrutalism-inspired design. The frontend communicates with a backend API to manage tasks, while **MongoDB** provides persistent database storage, allowing task data to be stored beyond the browser's local storage.

🌐 **Live Website:** [Visit What To-Do?](https://what-to-do-bice.vercel.app/)

📂 **GitHub Repository:** [View Source Code](https://github.com/tapobrata2002/What-TO-DO-)

---

## 🚀 Features

- 📝 **Task Creation** — Add new tasks using a simple input field.
- 📅 **Due Date Management** — Assign a due date to each task to keep track of deadlines.
- ✅ **Task Completion Tracking** — Mark tasks as completed or undo their completion status.
- 🗑️ **Task Deletion** — Remove tasks that are no longer needed.
- 🗄️ **MongoDB Database Integration** — Stores task data in a database for persistent data management.
- 🔗 **Backend API Integration** — Connects the React frontend with the backend to perform task management operations.
- 🔢 **Dynamic Task Counter** — Displays the total number of tasks in the task list.
- 📌 **Default Due Date Display** — Displays "Due Today" when a task is created without selecting a due date.
- 📱 **Responsive Interface** — Adapts the layout for desktop, tablet, and mobile screens.
- 🎨 **Neobrutalism UI** — Features bold typography, solid borders, contrasting colors, and distinctive shadow effects.
- ⚡ **Fast Development Environment** — Uses Vite for fast development and optimized production builds.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | Component-based frontend development |
| JavaScript (ES6+) | Application logic and task management |
| Vite 8 | Development server and production build tool |
| Node.js | Backend runtime environment |
| Express.js | Backend server and API development |
| MongoDB | Database for persistent task storage |
| REST API | Communication between frontend and backend |
| CSS3 | Styling, responsive layouts, and UI design |
| HTML5 | Application structure |
| Vercel | Deployment and hosting |

---

## 📂 Project Structure

```text
What-TO-DO-/
│
├── public/
│   ├── logo.svg
│   └── favicon.svg
│
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   └── Task.js
│   ├── routes/
│   │   └── taskRoutes.js
│   ├── controllers/
│   │   └── taskController.js
│   ├── server.js
│   └── package.json
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── .gitignore
```

---

## ⚙️ How It Works

### 1️⃣ Application Initialization

- React initializes the frontend application through the main entry point.
- Vite provides the development environment and production build system.
- The main application component manages the task interface and application state.
- The backend server handles incoming API requests from the frontend.

### 2️⃣ Task Creation

- Users enter a task in the input field.
- An optional due date can be selected using the date input.
- The frontend sends a request to the backend API to create a new task.
- The backend processes the request and stores the task in MongoDB.
- Empty task submissions are prevented.

### 3️⃣ Task Management

- Newly created tasks appear in the task list.
- Users can mark tasks as completed or undo their completion status.
- Tasks can be deleted when they are no longer required.
- Task updates and deletions are processed through the backend API.
- The task counter updates dynamically as tasks are added or removed.

### 4️⃣ Data Persistence

- React state manages the application's task data and user interface.
- The frontend communicates with the backend API to perform task-related operations.
- The backend handles data operations and communicates with MongoDB.
- MongoDB stores the task data persistently.
- Previously stored tasks can be retrieved from the database when the application loads.
- Task data is no longer dependent solely on the browser's localStorage.

### 5️⃣ Responsive User Interface

- The interface follows a Neobrutalism-inspired design approach.
- CSS media queries adapt the layout for different screen sizes.
- Interactive elements feature bold borders, contrasting colors, and shadow effects.

### 6️⃣ Deployment

- Vite generates optimized production files through the build process.
- The frontend is deployed using Vercel.
- The backend and database are configured to support the application's API and persistent data storage.
- Users can access the application through its live deployment URL.

---

## ▶️ Installation & Setup

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm (Node Package Manager)
- Git
- MongoDB database

### 1. Clone the Repository

```bash
git clone https://github.com/tapobrata2002/What-TO-DO-.git
```

### 2. Navigate to the Project Directory

```bash
cd What-TO-DO-
```

### 3. Install Frontend Dependencies

```bash
npm install
```

### 4. Configure the Backend

Navigate to the backend directory and install its dependencies.

```bash
cd backend
npm install
```

Configure the required environment variables for the backend, including your MongoDB connection string.

### 5. Start the Backend Server

```bash
npm run dev
```

### 6. Start the Frontend Development Server

Open another terminal in the project root directory and run:

```bash
npm run dev
```

Open the local development URL displayed in your terminal to access the application.

### 7. Build for Production

```bash
npm run build
```

### 8. Preview Production Build

```bash
npm run preview
```

---

## 🌐 Deployment

The frontend is deployed using **Vercel**.

The application uses a backend API connected to MongoDB for task management and persistent data storage.

Visit the live application:

🔗 [https://what-to-do-bice.vercel.app/](https://what-to-do-bice.vercel.app/)

---

## 🔮 Future Improvements

- Introduce task priority levels such as High, Medium, and Low.
- Add task categories for better organization.
- Implement task editing functionality.
- Introduce search, filtering, and sorting options.
- Add task statistics and completion progress tracking.
- Implement reminders and deadline notifications.
- Implement user authentication and personalized task management.
- Continue improving accessibility and the responsive user experience.

---

## 🤝 Contribution

This repository serves as a personal project focused on full-stack development and practical application building using React, backend APIs, and MongoDB.

Suggestions, feedback, and improvements are welcome.

If you find something worth improving, feel free to open an issue or submit a pull request.

---

## 👨‍💻 Author

**Tapobrata Roy**

Frontend Developer | Creative Professional

- GitHub: [tapobrata2002](https://github.com/tapobrata2002)

---

---

### 📝 WHAT TO-DO?

**Organize. Prioritize. Accomplish.**
