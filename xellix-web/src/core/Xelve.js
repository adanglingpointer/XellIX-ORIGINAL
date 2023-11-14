import React, { useState } from "react";
import classes from "../css/Xelve.module.css";
import XelveModal from "./XelveModal.js"
import Xellex from "./Xellex.js"

// 𝕀𝕟𝕤𝕥𝕒𝕝𝕝𝕖𝕣

const Xelve = (props) => {
  const [buttonState, setButtonState] = useState(classes.kdeg);
  const [showModal, setShowModal] = useState(false)

  const buttonDown = () => {
    setButtonState(classes.kde);
  };

  const buttonUp = () => {
    setButtonState(classes.kdeg);
  };

  const xelveModal = () => {
    setShowModal(!showModal);
  }



  return (
    <p>
      <span className={classes.installer}>
        <p>
          𝕀𝕟𝕤𝕥<span className={classes.smallemoji}>💖</span>𝕝𝕝𝕖𝕣
        </p>
      </span>

      <span className={classes.install}>
        <label for="install">Install: </label>
        <select name="install" id="install">
          <option value="javascript">KDE + xRDP on Debian 11</option>
          <option value="python">KDE + xRDP on Debian 12</option>
        </select>
        <button
          className={buttonState}
          onMouseDown={buttonDown}
          onMouseUp={buttonUp}
          onMouseOut={buttonUp}
          onClick={xelveModal}
        >
          Continue
        </button>
        {showModal ? <XelveModal/> : null}
      </span>
    </p>
  );
};

export default Xelve;
