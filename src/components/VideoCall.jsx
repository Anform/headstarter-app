import React, {useRef, useEffect} from 'react';
import ZoomMtgEmbedded from '@zoomus/websdk/embedded';
import './videocall.css'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { ModalDialog } from 'react-bootstrap';

function VideoCall() {
  const zoomIDRef = useRef(null);
  const zoomPWRef = useRef(null);
  const client = ZoomMtgEmbedded.createClient();
  const navigate = useNavigate()
  const {user} = UserAuth()

  useEffect(() => {
    if(!user) {
        navigate("/")
    }
  }, [user])

  // setup your signature endpoint here: https://github.com/zoom/meetingsdk-sample-signature-node.js
  var endPoint = 'https://headstarter-group-zoom-sign.herokuapp.com/'
  // This Sample App has been updated to use SDK App type credentials https://marketplace.zoom.us/docs/guides/build/sdk-app
  var sdkKey = 'Hg458B5SMFNbxhjMIOSsUivexrqX8C3Fssx1'
  var meetingNumber = ''
  var role = 0
  var userName = ''
  var userEmail = ''
  var passWord = ''
  // pass in the registrant's token if your meeting or webinar requires registration. More info here:
  // Meetings: https://marketplace.zoom.us/docs/sdk/native-sdks/web/component-view/meetings#join-registered
  // Webinars: https://marketplace.zoom.us/docs/sdk/native-sdks/web/component-view/webinars#join-registered
  var registrantToken = ''
  var topic = ''
  var password = ''
  var token = ''
  var zakToken = ''

  function getSignature(e) {
    e.preventDefault();

    meetingNumber = zoomIDRef.current.value;
    passWord = zoomPWRef.current.value;
    userName = user.displayName || user.email;

    fetch(endPoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meetingNumber: meetingNumber,
        role: role
      })
    }).then(res => res.json())
    .then(response => {
      startMeeting(response.signature)
    }).catch(error => {
      console.error(error)
    })
  }

  function createSignature() {
    meetingNumber = zoomIDRef.current.value;
    passWord = zoomPWRef.current.value;
    userName = user.displayName || user.email;

    fetch(endPoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meetingNumber: meetingNumber,
        role: role
      })
    }).then(res => res.json())
    .then(response => {

      fetch('http://localhost:4000/get-zak', {
        method: 'POST',
        body: JSON.stringify({
          token: token
        }),
        headers: { 'Content-Type': 'application/json' },
      }).then(res => res.json().then((object)=> {
        console.log(object)
      }))
      .catch(error => {
        console.error(error)
      })
      // createMeeting(response.signature)
    }).catch(error => {
      console.error(error)
    })
  }

  function getToken(e) {
    e.preventDefault();

    fetch(endPoint + 'create-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json().then((object)=> {
      token = object.access_token
    }))
    .catch(error => {
      console.error(error)
    }).then(()=> {
      
      topic = 'This is a test meeting';
      password = 'abc123';

      fetch(endPoint + 'create-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic,
          password: password,
          token: token
        })
      }).then(res => res.json().then ((object)=> {
        console.log(object);
        zoomIDRef.current.value = object.id;
        zoomPWRef.current.value = object.password;
      })).then(()=> {
        createSignature();
      })
    })
  }

  function startMeeting(signature) {
    let meetingSDKElement = document.getElementById('meetingSDKElement');

    client.init({
      debug: true,
      zoomAppRoot: meetingSDKElement,
      language: 'en-US',
      customize: {
        meetingInfo: ['topic', 'host', 'mn', 'pwd', 'telPwd', 'invite', 'participant', 'dc', 'enctype'],
        toolbar: {
          buttons: [
            {
              text: 'Custom Button',
              className: 'CustomButton',
              onClick: () => {
                console.log('custom button');
              }
            }
          ]
        }
      }
    })

    client.join({
    	sdkKey: sdkKey,
    	signature: signature,
    	meetingNumber: meetingNumber,
    	password: passWord,
    	userName: userName,
      userEmail: userEmail,
      tk: registrantToken
    })
  }

  function createMeeting(signature){
    let meetingSDKElement = document.getElementById('meetingSDKElement');

    client.init({
      debug: true,
      zoomAppRoot: meetingSDKElement,
      language: 'en-US',
      customize: {
        meetingInfo: ['topic', 'host', 'mn', 'pwd', 'telPwd', 'invite', 'participant', 'dc', 'enctype'],
        toolbar: {
          buttons: [
            {
              text: 'Custom Button',
              className: 'CustomButton',
              onClick: () => {
                console.log('custom button');
              }
            }
          ]
        }
      }
    })

    client.join({
    	sdkKey: sdkKey,
    	signature: signature,
    	meetingNumber: meetingNumber,
    	password: passWord,
    	userName: userName,
      userEmail: userEmail,
      zak: zakToken
    })

  }

  return (
    <div className="App">
      <main>
        {/* For Component View */}
        <div id="meetingSDKElement">
          {/* Zoom Meeting SDK Component View Rendered Here */}
        </div>

        <div className='call-button-area'>
          <form className='call-buttons'>
            <button className="btn-add" type="submit" onClick={getToken}> Create Meeting </button>
          </form>
        </div>

        <div className='call-button-area'>
          <form className='call-buttons'>
          <h5>Join a Zoom Meeting</h5>
             <input type="text" placeholder='Enter Zoom ID' ref={zoomIDRef} required/>
             <input type="text" placeholder='Enter Password' ref={zoomPWRef} required/>
            <button className="btn-add" type="submit" onClick={getSignature}>Join Meeting </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default VideoCall