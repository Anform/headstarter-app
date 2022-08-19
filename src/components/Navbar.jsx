import React, {useEffect, useState} from 'react'
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
  
    function Profile(){
      const [showProfile, setShowProfile] = useState(false);

        return <>
      <div className="profile-parent" onClick={
        ()=>{
            if(showProfile === false){
              setShowProfile(true)
            }
            else{
              setShowProfile(false)
            }
          }
        }>
        <div className="navButton">
          <button className="btn"><div className="btn-Container">
            <ProfileIcon className='nav-btn-icon'/>
            <i>Profile</i>
            </div>
          </button> 
        </div> 
      </div>
        
        <ul className="nav-user-menu" hidden={showProfile}>
             <div className='nav-user-header'> Signed in as <i>{user.displayName || user.email}</i></div> 
            {/* <li className="nav-user-item">
                <a href="/profile"> Profile </a>
            </li>
            <li className="nav-user-item">
                <a href="/update-profile"> Edit Profile </a>
            </li>
            <li className="nav-user-item">
                <a href="/account"> Account Settings </a>
            </li> */}
            <li className="nav-user-item">
                <button onClick={handleSignOut}> Sign Out </button>
            </li>
        </ul>
        </>
    }

  return (
    <>
    <nav className="navbar bg-transparent">
        <div className="container-fluid">
            <h1 className="Logo">Team<br></br>Tracker</h1>
            <div className='navButtons'>
            {user ? <Contact/> : "" }
            {user ? <Profile/> : "" }
            </div>
        </div>
    </nav>
    <Outlet />
    </>
  )
}
