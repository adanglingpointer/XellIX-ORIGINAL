import Xello from "./core/Xello";
import classes from "./css/Query.module.css";

function App() {
  return (
    <>
      <div className={classes.tabcontainer}>
        <div className={classes.tab}>
          <button
            className={classes.tablinks}
          >
            Lookup
          </button>
          <button
            className={classes.inactivetablinks}
          >
            Fix
          </button>
          <button
            className={classes.inactivetablinks}
          >
            Install
          </button>
        </div>
        <Xello />
      </div>
    </>
  );
}

export default App;
