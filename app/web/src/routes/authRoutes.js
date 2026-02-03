import LandingPage from "../LandingPage/LandingPage";
import Login from "../Component/Auth/Login";
import Register from "../Component/Auth/Register";
import ForgotPassword from "../Component/Auth/ForgotPassword";
import NotFound from "../Component/ErrorPages/NotFound";
import ServerError from "../Component/ErrorPages/ServerError";

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
