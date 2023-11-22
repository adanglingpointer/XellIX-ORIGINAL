import React, { useState, useRef } from "react";
import classes from "../css/Xelve.module.css";
import XelveModal from "./XelveModal.js"
import Xellex from "./Xellex.js"

// 𝕀𝕟𝕤𝕥𝕒𝕝𝕝𝕖𝕣

const Xelve = (props) => {
  const [buttonState, setButtonState] = useState(classes.kdeg);
  const [showModal, setShowModal] = useState(false);
  const [chosenOs, setChosenOs] = useState("debian11");
  const [tagline, setTagline] = useState(`Debian 11 - KDE (kde-plasma-desktop) + xRDP Installer`);

  const inputRef = useRef(null);

  const buttonDown = () => {
    setButtonState(classes.kde);
  };

  const buttonUp = () => {
    setButtonState(classes.kdeg);
  };

  const xelveModal = () => {
    setShowModal(!showModal);
  }

  const buttonOver = () => {
    setButtonState(classes.kdehover)
  }

  const setOs = () => {
    setChosenOs(inputRef.current.value);
    if (inputRef.current.value === "debian11") {
      setTagline(`Debian 11 - KDE (kde-plasma-desktop) + xRDP Installer`)
    }
    if (inputRef.current.value === "debian12") {
      setTagline(`Debian 12 - KDE (kde-plasma-desktop) + xRDP Installer`)
    }
    if (inputRef.current.value === "ubuntu2004") {
      setTagline(`Ubuntu 20.04 - KDE (Kubuntu) + xRDP Installer`)
    }
    if (inputRef.current.value === "ubuntu2204") {
      setTagline(`Ubuntu 22.04 - KDE (Kubuntu) + xRDP Installer`)
    }
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
        <select name="install" id="install" ref={inputRef} onClick={setOs}>
          <option value="debian11">KDE + xRDP on Debian 11</option>
          <option value="debian12">KDE + xRDP on Debian 12</option>
          <option value="ubuntu2004">KDE + xRDP on Ubuntu 20.04</option>
          <option value="ubuntu2204">KDE + xRDP on Ubuntu 22.04</option>
        </select>
        <button
          className={buttonState}
          onMouseDown={buttonDown}
          onMouseUp={buttonUp}
          onMouseOut={buttonUp}
          onClick={xelveModal}
          onMouseOver={buttonOver}
        >
          Continue
        </button>
        {showModal ? <XelveModal chosenOs={chosenOs} tagline={tagline} xelveModal={xelveModal} /> : null}
      </span>
    </p>
  );
};

export default Xelve;
