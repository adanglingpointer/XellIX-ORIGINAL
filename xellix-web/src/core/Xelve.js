import React, { useState } from "react";
import classes from "../css/Xelve.module.css";

// 𝕀𝕟𝕤𝕥𝕒𝕝𝕝𝕖𝕣

const Xelve = (props) => {
  return (
    <p>
      <span className={classes.installer}>
        <p>
          𝕀𝕟𝕤𝕥<span className={classes.smallemoji}>💖</span>𝕝𝕝𝕖𝕣
        </p>
      </span>
      Coming soon!
    </p>
  );
};

export default Xelve;
