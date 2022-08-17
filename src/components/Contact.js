import React, { useRef } from 'react'
import emailjs from '@emailjs/browser';
import { UserAuth } from '../context/AuthContext';

export default function Contact() {
  
  const form = useRef();
  const { user } = UserAuth()

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
    <form ref={form} onSubmit={sendEmail}>
      <input type="hidden" name="to_name" value={user.displayName} />
      <input type="hidden" name="user_email" value={user.email} />
      <input type="submit" value="Send Email" />
    </form>
  );
}
