import Home from "../Home/Home";
import Product from "../Product/Product";
import ProductDetail from "../Product/ProductDetail";
import Service from "../Component/Service/Service";
import Promotion from "../Promotion/Promotion";
import Cart from "../Cart/Cart";
import Account from "../Component/Account/Account";
import Checkout from "../Checkout/Checkout";
import { AboutUs, Contact, FAQ, RetailSystem, Terms } from "../Component/StaticPages/FooterPages";

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
        path: "product/:id",
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
