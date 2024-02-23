import Navbar from "./components/Navbar/navbar";
import "./App.css";
import Today from "./components/Today/today";
import Implement from "./components/Calendar/implement";
const Home = () => {
  return (
    <div className="App">
      <Navbar />
      <Today />
      <Implement />
      <cn />
    </div>
  );
};

export default Home;
