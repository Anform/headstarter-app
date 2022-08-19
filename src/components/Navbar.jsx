import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserAuth } from '../context/AuthContext';
import { Outlet } from 'react-router';
import Contact from './Contact';
import {ReactComponent as ProfileIcon} from './assets/profile-icon.svg'
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
            <div className='navButtons'>
            {user ? <Contact/> : "" }
            {user ? <div className="navButton"><button class="btn" onClick={handleSignOut}><div className="btn-Container"><ProfileIcon className='nav-btn-icon'/><i>Profile</i></div></button></div>  : "" }
            </div>
        </div>
    </nav>
    <Outlet />
    </>
  )
}
