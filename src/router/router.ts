import { createBrowserRouter } from "react-router";
import Main from "../pages/Main";
import Root from "../pages/Root";
import Detail from "@/pages/Detail/Detail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        path: "/",
        Component: Main,
      },
      {
        path: '/detail',
        Component:Detail,
      }
    ],
  },
]);
