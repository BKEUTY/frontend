import LandingPage from "../pages/LandingPage/LandingPage";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import ForgotPassword from "../components/Auth/ForgotPassword";
import NotFound from "../components/ErrorPages/NotFound";
import ServerError from "../components/ErrorPages/ServerError";

export const authRoutes = [
    {
        path: "/",
        element: <LandingPage />
    },
    {
        path: "login",
        element: <Login />
    },
    {
        path: "register",
        element: <Register />
    },
    {
        path: "forgot-password",
        element: <ForgotPassword />
    }
];

export const errorRoutes = [
    {
        path: "500",
        element: <ServerError />
    },
    {
        path: "*",
        element: <NotFound />
    }
];
