import Home from "../pages/Home/Home";
import Product from "../pages/Product/Product";
import ProductDetail from "../pages/Product/ProductDetail";
import Service from "../pages/Service/Service";
import Promotion from "../pages/Promotion/Promotion";
import Cart from "../pages/Cart/Cart";
import Account from "../pages/Account/Account";
import Checkout from "../pages/Checkout/Checkout";
import ThankYou from "../pages/Checkout/ThankYou";
import RetailSystem from "../pages/RetailSystem/RetailSystem";
import { AboutUs } from "../Component/StaticPages/AboutUs";
import { Contact } from "../Component/StaticPages/Contact";
import { FAQ } from "../Component/StaticPages/FAQ";
import { Terms } from "../Component/StaticPages/Terms";

export const userRoutes = [
    {
        path: "home",
        element: <Home />
    },
    {
        path: "product",
        element: <Product />
    },
    {
        path: "product/:slug",
        element: <ProductDetail />
    },
    {
        path: "service",
        element: <Service />
    },
    {
        path: "promotion",
        element: <Promotion />
    },
    {
        path: "cart",
        element: <Cart />
    },
    {
        path: "account/*",
        element: <Account />
    },
    {
        path: "checkout",
        element: <Checkout />
    },
    {
        path: "thank-you",
        element: <ThankYou />
    },
    {
        path: "about-brand",
        element: <AboutUs />
    },
    {
        path: "contact",
        element: <Contact />
    },
    {
        path: "faq",
        element: <FAQ />
    },
    {
        path: "retail-system",
        element: <RetailSystem />
    },
    {
        path: "terms",
        element: <Terms />
    }
];
