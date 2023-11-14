import { useState, useRef, React } from "react";
import classes from "../css/XelveModal.module.css";

// https://getbootstrap.com/docs/4.0/components/modal/

const XelveModal = (props) => {
  const [theResponse, setTheResponse] = useState("idle");

  const goInstall = async () => {
    var fetchInstaller = await fetch("http://108.175.11.49:3031/install", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      const decoder = new TextDecoder();

      for await (const data of response.body) {
        const text = decoder.decode(data);
        console.log(text);
        setTheResponse(text);
      }
    });
  };

  return (
    <div className={classes.modal}>
      meep <button onClick={goInstall}>clicky</button>
      <br />
      <input
        type="text"
        value={theResponse}
        className={classes.terminal}
      ></input>
    </div>
  );
};

export default XelveModal;
