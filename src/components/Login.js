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

export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const {logIn, googleSignIn, user} = UserAuth()
  const navigate = useNavigate()

  const handleGoogleSignIn = async () => {
    try {
        await googleSignIn()
    } catch (error) {
        console.log(error)
    }
  }

  async function handleSubmit(e){
    e.preventDefault()

    try{
        setError('')
        setLoading(true)
        await logIn(emailRef.current.value, passwordRef.current.value)
        navigate('/')
    } catch (error) {
        var errorMessage = error.message
        var str = errorMessage.substr(errorMessage.indexOf(":") + 1);
        setError('Failed to sign in: ' + str)
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
            <h2 className ="text-start mb-4 fw-bold"> Welcome Back!</h2>
            <h3 className ="text-start mb-4"> Sign in to keep track of your team tasks!</h3>
            </div>
            {error && <Alert variant = "danger">{error}</Alert>}
            <div className="d-flex justify-content-center">
              <GoogleButton onClick={handleGoogleSignIn} style={{color:"grey", textAlign:"start",width:"82%", borderRadius:"30px", fontFamily: 'Inter', fontStyle:'normal', backgroundColor: "white" ,overflow:'hidden', boxShadow:"none"}}/>
            </div>
              <hr className="hrdivider">
                </hr>
            <Form className = "Form" onSubmit ={handleSubmit}>
                <Form.Group id = "email">
                    <div className="input-group justify-content-center">
                    <span className="input-group-text" id="basic-addon1"><EmailIcon className="auth-icon"/></span>
                    <Form.Control type="email" ref={emailRef} placeholder="Email address" required/>
                    </div>
                </Form.Group>
                <Form.Group id = "password">
                    <div className="input-group justify-content-center">
                    <span className="input-group-text" id="basic-addon1"> <LockIcon className="auth-icon"/> </span>
                    <Form.Control type="password" ref={passwordRef} placeholder="Password" required/>
                    </div>
                </Form.Group>
                <Button className="button" disabled = {loading} type="submit" style={{backgroundColor:"#FF5C00"}}>Login</Button>
                <div className='Link'>
                    <Link to="/forgot-password" style={{color: "#273240aa",textDecoration: 'none'}}> Forgot Password? </Link>
                <div className='Link' >
                    <Link to ="/signup" style={{color: "#273240aa", textDecoration: 'none'}}>Sign up</Link>
                </div>
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
