import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { UserAuth } from '../context/AuthContext'
import { Link } from "react-router-dom"
import {ReactComponent as EmailIcon} from './assets/email-icon.svg'
import './auth.css'

export default function ForgotPassword() {
    const emailRef = useRef()
    const { resetPassword} = UserAuth()
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e){
        e.preventDefault()

        try{
            setMessage('')
            setError('')
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage('Instructions to reset your password will be sent to you. Please check your email.')
        } catch (error) {
            setError("Failed to send password reset email.")
        }
        setLoading(false)
    }

    return (
    <>
    <div className='Container'>
    <div className= "Body" id="bootstrap-overrides">
    <Card className ="Card">
        <Card.Body>
            <h2 className ="text-center mb-4">Forgot Your Password?</h2>
            <p className ="text-right mb-4"> Enter the email address you used to sign up and we’ll send you instructions to reset your password. </p>
            {error && <Alert variant = "danger">{error}</Alert>}
            {message && <Alert variant = "success">{message}</Alert>}
            <Form onSubmit ={handleSubmit}>
            <Form.Group id = "email">
                    <div class="input-group justify-content-center">
                    <span class="input-group-text" id="basic-addon1"><EmailIcon className="auth-icon"/></span>
                    <Form.Control type="email" ref={emailRef} placeholder="Enter an email address" required/>
                    </div>
                </Form.Group>
                <br></br>
                <Button className="button" disabled = {loading} style={{backgroundColor:"#FF5C00"}} type="submit">Reset Password</Button>
            </Form>
            <div className='Link'>
                <Link to="/"> Log in</Link>
            </div>
            <div className='Link'>
            Not a member? <Link to ="/signup">Sign up now</Link>
        </div>
        </Card.Body>
    </Card>
    </div>
    </div>
    </>
    )
}
