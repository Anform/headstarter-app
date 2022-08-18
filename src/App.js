import React from "react"
import FirebaseCalendar from "./FirebaseCalendar";
import Login from "./components/Login"  
import Navbar from "./components/Navbar" 
import VideoCall from "./components/VideoCall";
import Contact from "./components/Contact";
import { AuthContextProvider } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <AuthContextProvider>
      <Router>
      <Navbar/>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/calender" element={<FirebaseCalendar/>}/>
          <Route path="/videocall" element={<VideoCall/>}/>
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
