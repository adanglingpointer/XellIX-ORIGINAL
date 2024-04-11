import { React, useState } from "react";
import classes from "../css/Header.module.css";
import Xello from "./Xello";
import Xelve from "./Xelve";

const Header = (props) => {
  return (
    <div className={classes.header}>
      <h1>XellIX</h1>
      <span className={classes.version}>1.1.2</span>
    </div>
  );
};

export default Header;
