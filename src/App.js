import React from "react"
import FirebaseCalendar from "./FirebaseCalendar";
import Login from "./components/Login"  
import Navbar from "./components/Navbar" 
import { AuthContextProvider } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"


function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/calender" element={<FirebaseCalendar/>}/>
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
