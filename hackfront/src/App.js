import "./App.css";
import Signup from "./components/Calendar/Login/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Calendar/Login/Login";
import Home from "./Home";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/home/" element={<Home />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/" element={<Signup />} />
          <Route path="/home/:id" element={<Home />} />
          <Route path="/home/:id/:taskId" element={<Home />} />

          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
