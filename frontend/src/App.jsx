import { useSelector } from "react-redux";
import Homepage from './components/Homepage/Homepage';
import Navigation from './components/Navigation/Navigation';
import "./global.css";

function App() {
  const parts = useSelector((state) => state.inventory.parts);

  return (
    <>
      <Homepage parts={parts} />
      <Navigation />
    </>
  )
}

export default App;
