import Xello from "./core/Xello";
import classes from "./css/Query.module.css";

function App() {
  return (
    <>
      <div className={classes.tabcontainer}>
        <div className={classes.tab}>
          <button
            className={classes.tablinks}
            onclick="openCity(event, 'London')"
          >
            Lookup
          </button>
          <button
            className={classes.inactivetablinks}
            onclick="openCity(event, 'Paris')"
          >
            Fix
          </button>
          <button
            className={classes.inactivetablinks}
            onclick="openCity(event, 'Tokyo')"
          >
            Administer
          </button>
        </div>
        <Xello />
      </div>
    </>
  );
}

export default App;
