import { useState } from "react";
import XellIX from "./core/XellIX";

function App() {
  const [lookupStatus, setLookupStatus] = useState("rest");

  return (
    <XellIX/>
  );
}

export default App;
