import { useEffect, React } from "react";
import classes from "../css/Query.module.css";

const DomainQuery = (props) => {
  useEffect(() => {
//
  });

  const fetchResponse = async (domain) => {
    const response = await fetch(
      `http://108.175.11.49:3031/google.com`
      );
    if (!response.ok) {
      //throw new Error("Whoopsies! We have an error =[");
      //console.log(response);
    }
    const responseData = await response.json();
    console.log(responseData.mailServer);
    props.resetLookupStatus();
    props.updatePage({mailServer: responseData.mailServer});
  };

  return (
    <div className={classes.query}>
      <textarea />
      <button onClick={fetchResponse} onMouseDown={props.changeLookupStatus}>click</button>
    </div>
  );
};

export default DomainQuery;
