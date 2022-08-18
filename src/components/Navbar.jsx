import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserAuth } from '../context/AuthContext';
import { Outlet } from 'react-router';
import Contact from './Contact';
import './navbar.css'


export default function Navbar() {

  const {user, logOut} = UserAuth()
    
  const handleSignOut = async () => {
    try {
        await logOut()
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <>
    <nav class="navbar bg-transparent">
        <div class="container-fluid">
            <h1 className="Logo">Team<br></br>Tracker</h1>
            {user ? <Contact/> : "" }
            {user ? <button onClick={handleSignOut}>Logout</button> : "" }
        </div>
    </nav>
    <Outlet />
    </>
  )
}
