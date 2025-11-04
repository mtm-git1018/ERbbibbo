import { createBrowserRouter } from "react-router";
import Main from "../pages/Main";
import Root from "../pages/Root";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        path: "/",
        Component: Main,
      },
    ],
  },
]);
