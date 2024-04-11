import { useState, useRef, React } from "react";
import Xello from "./core/Xello";
import classes from "./css/Query.module.css";
import Header from "./core/Header";
import Xellex from "./core/Xellex";
import Xelve from "./core/Xelve";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./core/Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    // errorElement: <ErrorPage />,
    children: [{ index: true, element: null }],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
