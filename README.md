# Freelancing Web App (React)

> A secure and professional platform connecting project owners and freelancers in the Arab world, designed to streamline hiring, collaboration, and remote project management.

## 📖 Project Overview

This project aims to provide an integrated platform that allows project owners to clearly present their ideas and requirements, while enabling freelancers to showcase their skills and apply for suitable projects. The system follows a seamless and interconnected structure—from registration, searching, and applying, to contracting and payment management—ensuring a hassle-free user experience.
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://react.dev/)

---

## 📸 Screenshots

### Backend-driven views (Frontend WIP)

<p align="center">
  <img src="https://github.com/Mohannad7Ali/Freelancing-Wep-App-React/raw/main/assets/screenshots/Picture1.png" alt="p1" width="48%">
  <img src="https://github.com/Mohannad7Ali/Freelancing-Wep-App-React/raw/main/assets/screenshots/Picture2.png" alt="p2" width="48%">
  <img src="https://github.com/Mohannad7Ali/Freelancing-Wep-App-React/raw/main/assets/screenshots/Picture3.png" alt="Picture3" width="48%">
  <img src="https://github.com/Mohannad7Ali/Freelancing-Wep-App-React/raw/main/assets/screenshots/Picture4.png" alt="Picture4" width="48%">
  <img src="https://github.com/Mohannad7Ali/Freelancing-Wep-App-React/raw/main/assets/screenshots/Picture5.png" alt="Picture3" width="48%">
  <img src="https://github.com/Mohannad7Ali/Freelancing-Wep-App-React/raw/main/assets/screenshots/Picture6.png" alt="Picture6" width="48%">
  <img src="https://github.com/Mohannad7Ali/Freelancing-Wep-App-React/raw/main/assets/screenshots/Picture7.png" alt="Picture7" width="48%">
  <img src="https://github.com/Mohannad7Ali/Freelancing-Wep-App-React/raw/main/assets/screenshots/Picture8.png" alt="Picture8" width="48%">
</p>
## 🚀 Technologies Used

### ⚙️ Back-End

- **Environment & Framework:** **Node.js** and **Express.js** for efficient, event-driven, non-blocking I/O request handling.
- **Database (NoSQL):** **MongoDB** for schema flexibility, utilizing **Mongoose** (ODM) for data structuring and validation.
- **Authentication & Security:** **JSON Web Tokens (JWT)** for secure user sessions and route protection via Middleware.
- **Media Management:** **Cloudinary** integration for dynamic image processing, storage, and CDN distribution.
- **Package Manager:** **Yarn** for fast and reliable dependency installation.

### 💻 Front-End

- **Core Library:** **React.js** utilizing the Virtual DOM for fast and efficient UI updates.
- **Build Tool:** **Vite** for an ultra-fast development environment with Hot Module Replacement (HMR).
- **State Management & Data Fetching:**
  - `React Query`: For server state management, data fetching, and caching.
  - `Axios`: For handling HTTP requests and API integration.
- **Routing:** **React Router DOM** for seamless, single-page application navigation.
- **Styling:** **Sass (SCSS)** for flexible, maintainable, and reusable styles.
- **Utility Libraries:** `Moment.js` (dates), `Lucide React` (icons), `Infinite React Carousel` (sliders).

### 📱 Mobile App

- Cross-platform mobile application developed using **Flutter**.

## 🌍 Hosting & Infrastructure

- **Servers:** Hosted on **Render** for fast deployment, high availability, and auto-scaling.
- **Database:** Fully managed cloud database hosted on **MongoDB Atlas**.

## 🛠️ Installation & Setup

### Prerequisites

Ensure you have the following installed on your local machine before proceeding:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- A MongoDB Atlas account (or a local MongoDB instance)
- A Cloudinary account for media management

### 1. Clone the Repository

```bash
git clone [https://github.com/Mohannad7Ali/Freelancing-Wep-App-React.git](https://github.com/Mohannad7Ali/Freelancing-Wep-App-React.git)
cd Freelancing-Wep-App-React
```

## 2. Install Dependencies

You need to install the dependencies for both the backend and frontend.

### Backend:

```bash
cd backend
yarn install
```

### Frontend:

```bash
cd ../frontend
yarn install
```

## 3.Environment Variables

Create a .env file in the root of both the backend and frontend directories and add the required variables.

### Backend (backend/.env):

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend (frontend/.env):

```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

## 4. Running the Application

Start the development servers for both environments.

#### Start Backend:

```bash
  cd backend
  yarn dev
```

#### Start Frontend:

```bash
  cd frontend
  yarn dev
```

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

- **Backend:** Especially welcome are improvements to API performance and database query optimizations.
- **Real-Time:** New features for Socket.IO or WebRTC (like screen sharing or group calls) are highly encouraged.
- **Frontend:** Help us complete the administrative dashboards and refine the user experience.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information. This project is free to use, learn from, and extend for your own purposes.

---

<p align="center">
  Built with <b>passion</b> and <b>precision</b> by <a href="https://github.com/Mohannad7Ali">Mohannad Ali</a>.
</p>
