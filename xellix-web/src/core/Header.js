import { React } from "react";
import classes from "../css/Header.module.css";

const Header = (props) => {
  return (
    <div className={classes.header}>
      <h1>XellIX</h1>
      <span className={classes.version}>1.2.0</span>
    </div>
  );
};

export default Header;
