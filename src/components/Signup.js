import React, { useEffect, useRef, useState  } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import GoogleButton from 'react-google-button'
import { UserAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import './auth.css'
import LoginBackground from './assets/login-background.png'
import {ReactComponent as EmailIcon} from './assets/email-icon.svg'
import {ReactComponent as LockIcon} from './assets/lock-icon.svg'
import {ReactComponent as Ellipse} from './assets/ellipse.svg'
import {ReactComponent as Ellipse2} from './assets/ellipse-2.svg'

export default function Signup() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const {signUp, user} = UserAuth()
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    if(passwordRef.current.value !== passwordConfirmRef.current.value){
        return setError('Passwords do not match')
    }
    try{
        setError('')
        setLoading(true)
        await signUp(emailRef.current.value, passwordRef.current.value)
    } catch (error){
        var errorMessage = error.message
        var str = errorMessage.substr(errorMessage.indexOf(":") + 1);
        str = str.substring(0, str.lastIndexOf(" "));
        setError(str)
    }
    setLoading(false)
  }

  useEffect(() => {
    if(user != null) {
        navigate("/calendar")
    }
  }, [user])

  return (
    <div className= "Wrapper"> 

    <div className= "Body" id="bootstrap-overrides">
     <div className='Header'>
      <h1 className="Logo">Team<br></br>Tracker</h1>
      <Ellipse className='ellipse-1'/>
    </div> 

    <Card className ="Card">
        <Card.Body className ="Card-Body">
            <div className = "Card-Header">
            <h2 className ="text-start mb-4 fw-bold"> Welcome!</h2>
            <h3 className ="text-start mb-4"> Sign up to join your team!</h3>
            </div>
            {error && <Alert variant = "danger">{error}</Alert>}
            <Form className = "Form" onSubmit ={handleSubmit}>
                <Form.Group id = "email">
                    <div className="input-group justify-content-center">
                    <span className="input-group-text" id="basic-addon1"><EmailIcon className="auth-icon"/></span>
                    <Form.Control type="email" ref={emailRef} placeholder="Enter an email address" required/>
                    </div>
                </Form.Group>
                <Form.Group id = "password">
                    <div className="input-group justify-content-center">
                    <span className="input-group-text" id="basic-addon1"> <LockIcon className="auth-icon"/> </span>
                    <Form.Control type="password" ref={passwordRef} placeholder="Enter a password" required/>
                    </div>
                </Form.Group>
                <Form.Group id = "password-confirm">
                    <div className="input-group justify-content-center">
                    <span className="input-group-text" id="basic-addon1"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#c6c9cc" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg> </span>
                    <Form.Control type="password" ref={passwordConfirmRef} placeholder="Confirm password" required/>
                    </div>
                </Form.Group>
                <Button className="button" disabled = {loading} type="submit" style={{backgroundColor:"#FF5C00"}}>Sign Up</Button>
                <div className='Link' >
                Already a member? <Link to ="/" style={{color: "#273240aa", textDecoration: 'none'}}>Login</Link>
                </div>
            </Form>
        </Card.Body>
        </Card>

        <div className='ellipseContainer'>
        <Ellipse2 className='ellipse-2'/>
        </div>
      </div>

      <div className="Sidebar">
        <img className='Background' src={LoginBackground} >
        </img>
      </div>
    </div>
  )
}
