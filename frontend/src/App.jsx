import { useState } from "react";
import Homepage from './components/Homepage/Homepage';
import Navigation from './components/Navigation/Navigation';
import "./global.css";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <>
      <Homepage activePage={activePage}/>
      <Navigation setActivePage={setActivePage}/>
    </>
  );
}

export default App;
