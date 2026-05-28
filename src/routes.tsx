import { createBrowserRouter } from "react-router";
import { StoreFront } from "./pages/StoreFront";
import { ShopPage } from "./pages/ShopPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { NotFound } from "./pages/NotFound";
import { ProductPage } from "./pages/ProductPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: StoreFront,
  },
  {
    path: "/shop",
    Component: ShopPage,
  },
  {
    path: "/product/:id",
    Component: ProductPage,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);