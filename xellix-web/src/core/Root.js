import { Outlet } from "react-router-dom";
import Header from "./Header";
import { React } from "react";

function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default RootLayout;
