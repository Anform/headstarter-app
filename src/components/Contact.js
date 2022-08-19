import React, { useRef, useState } from 'react'
import emailjs from '@emailjs/browser';
import { UserAuth } from '../context/AuthContext';
import {ReactComponent as Notification} from './assets/bell-icon.svg'
import { Button, Modal } from 'react-bootstrap'
import './navbar.css'

export default function Contact() {
  const form = useRef();
  const { user } = UserAuth()
  const [modalShow, setModalShow] = React.useState(false);

  function MyVerticallyCenteredModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Would you like to notify for an upcoming meeting?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Notify your group about a meeting. </h5>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="danger" onClick={props.onHide}>Cancel</Button>
        <Button variant="primary" onClick={sendEmail}>
              Notify
        </Button>
      </Modal.Footer>
        </Modal>
    );
  }

  const sendEmail = (e) => {
    e.preventDefault();
    console.log(form.current)
    emailjs.sendForm('service_nch5z1m', 'template_d4pw78o', form.current, '-HxLRBDaoyOHPAx85')
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });
  };

  return (
    <>
    <MyVerticallyCenteredModal
    show={modalShow}
    onHide={() => setModalShow(false)
    }/>
    
    <form className="navButton" ref={form} onSubmit={(e) => {setModalShow(true); e.preventDefault();}}>
      <input type="hidden" name="to_name" value={user.displayName} />
      <input type="hidden" name="user_email" value={user.email} />
      <button className="btn" type="submit" value="Send Email"> <div className="btn-Container"><Notification className='nav-btn-icon'/> <i>Notifications</i></div></button>
    </form>
    </>

  );
}
