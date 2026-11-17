# 📝 What To-Do? — Task Management Application

### Organize. Prioritize. Accomplish.

Turn everyday tasks into organized progress, one task at a time.

**What To-Do?** is a responsive task management application designed to help users organize their daily activities, keep track of deadlines, and manage task completion through a simple and intuitive interface.

Built with **React 19** and powered by **Vite**, the application combines essential task management functionality with a bold Neobrutalism-inspired design. Tasks are automatically saved in the browser using localStorage, allowing users to retain their task lists even after refreshing the page.

🌐 **Live Website:** [Visit What To-Do?](https://what-to-do-bice.vercel.app/)

📂 **GitHub Repository:** [View Source Code](https://github.com/tapobrata2002/What-TO-DO-)

---

## 🚀 Features

- 📝 **Task Creation** — Add new tasks using a simple input field.
- 📅 **Due Date Management** — Assign a due date to each task to keep track of deadlines.
- ✅ **Task Completion Tracking** — Mark tasks as completed or undo their completion status.
- 🗑️ **Task Deletion** — Remove tasks that are no longer needed.
- 💾 **Local Storage Persistence** — Automatically saves tasks in the browser using localStorage.
- 🔢 **Dynamic Task Counter** — Displays the total number of tasks in the task list.
- 📌 **Default Due Date Display** — Displays "Due Today" when a task is created without selecting a due date.
- 📱 **Responsive Interface** — Adapts the layout for desktop, tablet, and mobile screens.
- 🎨 **Neobrutalism UI** — Features bold typography, solid borders, contrasting colors, and distinctive shadow effects.
- ⚡ **Fast Development Environment** — Uses Vite for fast development and optimized production builds.

---

## 🛠️ Tech Stack

| Technology           | Purpose                                      |
| -------------------- | -------------------------------------------- |
| React 19             | Component-based frontend development         |
| JavaScript (ES6+)    | Application logic and task management        |
| Vite 8               | Development server and production build tool |
| CSS3                 | Styling, responsive layouts, and UI design   |
| HTML5                | Application structure                        |
| Browser localStorage | Persistent task data storage                 |
| Vercel               | Deployment and hosting                       |

---

## 📂 Project Structure

```text
What-TO-DO-/
│
├── public/
│   ├── logo.svg              # Application logo
│   └── favicon.svg           # Website favicon
│
├── src/
│   ├── App.jsx               # Main application and task logic
│   ├── App.css               # Application styling and responsive UI
│   ├── index.css             # Global CSS reset and styles
│   └── main.jsx              # React application entry point
│
├── index.html                # HTML entry point
├── package.json              # Dependencies and scripts
├── package-lock.json         # Dependency lock file
├── vite.config.js            # Vite configuration
└── .gitignore                # Git ignored files
```

---

## ⚙️ How It Works

### 1️⃣ Application Initialization

- React initializes the application through the main entry point.
- Vite provides the development environment and production build system.
- The main application component manages the task interface and application state.

### 2️⃣ Task Creation

- Users enter a task in the input field.
- An optional due date can be selected using the date input.
- The application creates a new task with a unique identifier and an initial pending status.
- Empty task submissions are prevented.

### 3️⃣ Task Management

- Newly created tasks appear in the task list.
- Users can mark tasks as completed or undo their completion status.
- Tasks can be deleted when they are no longer required.
- The task counter updates dynamically as tasks are added or removed.

### 4️⃣ Data Persistence

- React state manages the application's task data.
- The application uses the browser's localStorage to save the task list.
- Whenever the task list changes, the updated data is stored automatically.
- Previously saved tasks are loaded when the application starts, allowing data to remain available after a page refresh.

### 5️⃣ Responsive User Interface

- The interface follows a Neobrutalism-inspired design approach.
- CSS media queries adapt the layout for different screen sizes.
- Interactive elements feature bold borders, contrasting colors, and shadow effects.

### 6️⃣ Deployment

- Vite generates optimized production files through the build process.
- The production application is deployed using Vercel.
- Users can access the application through its live deployment URL.

---

## ▶️ Installation & Setup

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm (Node Package Manager)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/tapobrata2002/What-TO-DO-.git
```

### 2. Navigate to the Project Directory

```bash
cd What-TO-DO-
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

Open the local development URL displayed in your terminal to access the application.

### 5. Build for Production

```bash
npm run build
```

### 6. Preview Production Build

```bash
npm run preview
```

---

## 🌐 Deployment

The project is deployed using **Vercel**.

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
- Explore cloud-based data storage and user authentication.
- Continue improving accessibility and the responsive user experience.

---

## 🤝 Contribution

This repository serves as a personal project focused on frontend development and practical React application building.

Suggestions, feedback, and improvements are welcome.

If you find something worth improving, feel free to open an issue or submit a pull request.

---

## 👨‍💻 Author

**Tapobrata Roy**

Frontend Developer | Creative Professional

- GitHub: [tapobrata2002](https://github.com/tapobrata2002)

---

\<p align="center">   \<strong>WHAT TO-DO?\</strong>   \<br/>   Organize. Prioritize. Accomplish.   \<br/>\<br/>   Made with ❤️ and React. \</p>
