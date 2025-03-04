import { useState } from "react";
import { useSelector } from "react-redux";
import Homepage from './components/Homepage/Homepage';
import Navigation from './components/Navigation/Navigation';
import "./global.css";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const parts = useSelector((state) => state.inventory.parts);

  return (
    <>
      <Homepage activePage={activePage} parts={parts}/>
      <Navigation setActivePage={setActivePage}/>
    </>
  )
}

export default App;
