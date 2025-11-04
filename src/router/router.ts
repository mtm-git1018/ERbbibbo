import { createBrowserRouter } from "react-router";
import Main from "../pages/Main";
import Root from "../pages/Root";
import Detail from "@/pages/Detail";
import Call from "@/pages/Call";

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
        path: '/:id',
        Component:Detail,
      }, {
        path: '/call',
        Component:Call,
      }
    ],
  },
]);
