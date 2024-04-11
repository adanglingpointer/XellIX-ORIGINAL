import { Outlet } from "react-router-dom";
import Header from "./Header";
import classes from "../css/Query.module.css";

function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default RootLayout;
