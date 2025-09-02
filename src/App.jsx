import "./app.scss";
import { createBrowserRouter, Outlet, RouterProvider, useLocation } from "react-router-dom";
import {React, useEffect  } from "react";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Gigs from "./pages/gigs/Gigs";
import Gig from "./pages/gig/Gig";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Add from "./pages/add/Add";
import Orders from "./pages/orders/Orders";
import Messages from "./pages/messages/Messages";
import Message from "./pages/message/Message";
import MyGigs from "./pages/myGigs/MyGigs";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import Pay from "./pages/pay/Pay";
import Success from "./pages/success/Success";
import UserProfile from "./pages/profile/profile";
import EditProfile from "./pages/EditProfile/EditProfile";
import newRequest from "./utils/newRequest";
import Projects from "./pages/projects/Projects";
import Project from "./pages/project/Project";
import Confirm from "./pages/confirm/Confirm";
import AddProject from "./pages/addProject/AddProject";
import MyProjects from "./pages/myProjects/MyProjects";
function App() {



  const queryClient = new QueryClient();

  const Layout = () => {
        const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await newRequest.get("/auth/validate");
      } catch (err) {
        localStorage.removeItem("currentUser");
        // if (location.pathname !== "/login" || location.pathname !== "/register") {
        //   window.location.href = "/login";
        // }
      }
    };

    checkAuth();
  }, [location.pathname]);
    return (
      <div className="app app-layout">
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <div className="main-content">
            <Outlet />
          </div>
          <Footer />
        </QueryClientProvider>
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/gigs",
          element: <Gigs />,
        },
        {
          path: "/projects",
          element: <Projects />,
        },
        {
          path: "/myGigs",
          element: <MyGigs />,
        },
        {
          path: "/myprojects",
          element: <MyProjects />,
        },
        {
          path: "/orders",
          element: <Orders />,
        },
        {
          path: "/messages",
          element: <Messages />,
        },
        {
          path: "/message/:id",
          element: <Message />,
        },
        {
          path: "/add",
          element: <Add />,
        },
        {
          path: "/addProject",
          element: <AddProject />,
        },
        {
          path: "/gig/:id",
          element: <Gig />,
        },
        {
          path: "/project/:id",
          element: <Project />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/profile",
          element: <UserProfile />,
        },
        {
          path: "/editprofile",
          element: <EditProfile />,
        },
  
        {
          path: "/confirm/:id",
          element: <Confirm />,
        },
        {
          path: "/pay/:id",
          element: <Pay />,
        },
        {
          path: "/success",
          element: <Success />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
