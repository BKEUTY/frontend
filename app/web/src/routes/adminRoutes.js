import { Navigate } from "react-router-dom";
import Dashboard from "../Component/Admin/Dashboard/Dashboard";
import ProductList from "../Component/Admin/Products/ProductList";
import ProductCreate from "../Component/Admin/Products/ProductCreate";
import Placeholder from "../Component/Admin/Placeholder";

export const adminRoutes = [
    {
        index: true,
        element: <Navigate to="dashboard" replace />
    },
    {
        path: "dashboard",
        element: <Dashboard />
    },
    {
        path: "products",
        element: <ProductList />
    },
    {
        path: "products/create",
        element: <ProductCreate />
    },
    {
        path: "orders",
        element: <Placeholder title="Orders" />
    },
    {
        path: "services",
        element: <Placeholder title="Services" />
    },
    {
        path: "appointments",
        element: <Placeholder title="Appointments" />
    },
    {
        path: "staff",
        element: <Placeholder title="Staff" />
    },
    {
        path: "reports",
        element: <Placeholder title="Reports" />
    }
];
