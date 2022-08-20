import React, {useRef, useEffect, useState} from 'react';
import ZoomMtgEmbedded from '@zoomus/websdk/embedded';
import './videocall.css'
import { UserAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button, Modal } from 'react-bootstrap'
import toast from 'react-hot-toast';
// import toast from 'react-hot-toast';

function VideoCall() {
  const zoomIDRef = useRef(null);
  const zoomPWRef = useRef(null);
  const topicRef = useRef(null);
  const createPWRef = useRef(null);
  const client = ZoomMtgEmbedded.createClient();
  const navigate = useNavigate()
  const {user} = UserAuth()
  const location = useLocation();
  const [modalShow, setModalShow] = React.useState(false);

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
  var redirectLink = 'https://zoom.us/oauth/authorize?response_type=code&client_id=PnIseBlsS8KzyhYDz3o_vQ&redirect_uri=http://localhost:3000/calendar'
  const [code, setCode] = useState(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    setCode(urlParams.get('code'));
  }, [location]);

  useEffect(() => {
    if(code !== null){
      console.log(code)
      setModalShow(true);
    }
  }, [code])

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
            Set Meeting Topic and Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label className="col-form-label">Meeting Topic:</label>
              <input type="text" ref={topicRef} className="form-control" placeholder='Topic...' id="recipient-name"/>
            </div>
            <div className="form-group">
              <label className="col-form-label">Meeting Password:</label>
              <input type="text" ref={createPWRef} className="form-control" placeholder='Leave empty to generate random password.' id="message-text"/>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="danger" onClick={props.onHide}>Cancel</Button>
        <Button variant="primary" onClick={() => {
          topic = topicRef.current.value;
          password = createPWRef.current.value;
          getToken();
          setModalShow(false);
        }}>
              Set
        </Button>
      </Modal.Footer>
        </Modal>
    );
  }
  
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

  function startMeeting(signature) {
    let meetingSDKElement = document.getElementById('meetingSDKElement');

    client.init({
      debug: true,
      zoomAppRoot: meetingSDKElement,
      language: 'en-US',
      customize: {
        meetingInfo: ['topic', 'host', 'mn', 'pwd', 'telPwd', 'invite', 'participant', 'dc', 'enctype'],
        toolbar: {
        }
      }
    })

    client.join({
    	sdkKey: sdkKey,
    	signature: signature,
    	meetingNumber: meetingNumber,
    	password: passWord,
    	userName: userName,
      tk: registrantToken
    })
  }

  function getToken() {
    fetch(endPoint + 'create-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: code,
      }),
    }).then(res => res.json().then((object)=> {
      console.log(object)
      token = object.access_token
    }))
    .catch(error => {
      toast.error(error);
      console.error(error)
    }).then(()=> {
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
        userName = object.host_email;
        zoomIDRef.current.value = object.id;
        zoomPWRef.current.value = object.password;
      })).then(()=> {
        createSignature();
      })
    })
  }

  function createSignature() {
    fetch(endPoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meetingNumber: zoomIDRef.current.value,
        role: 1
      })
    }).then(res => res.json())
    .then(response => {
      fetch(endPoint + 'get-zak', {
        method: 'POST',
        body: JSON.stringify({
          token: token
        }),
        headers: { 'Content-Type': 'application/json' },
      }).then(res => res.json().then((object)=> {
        console.log(object.token)
        zakToken = object.token;
      }))
      .catch(error => {
        toast.error(error);
        console.error(error)
      })
      createMeeting(response.signature)
    }).catch(error => {
      toast.error(error);
      console.error(error)
    })
  }

  function createMeeting(signature){
    let meetingSDKElement = document.getElementById('meetingSDKElement');
    
    meetingNumber = zoomIDRef.current.value;
    console.log(meetingNumber);
    passWord = zoomPWRef.current.value;

    client.init({
      debug: true,
      zoomAppRoot: meetingSDKElement,
      language: 'en-US',
      customize: {
        meetingInfo: ['topic', 'host', 'mn', 'pwd', 'telPwd', 'invite', 'participant', 'dc', 'enctype'],
        toolbar: {
        }
      }
    })

    client.join({
    	sdkKey: sdkKey,
    	signature: signature,
    	meetingNumber: meetingNumber,
    	password: passWord,
    	userName: userName,
      tk: registrantToken,
      zak: zakToken,
      success: (success) => {
        console.log(success)
      },
      error: (error) => {
        console.log(error)
      }
    }).catch(e => {
      console.log(e);
  });
  }

  return (
    <div className="App">
        <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)
        }/>
      <main>
        {/* For Component View */}
        <div id="meetingSDKElement">
          {/* Zoom Meeting SDK Component View Rendered Here */}
        </div>

        <div className='call-button-area'>
          <form className='call-buttons'>
          <h5>Create a Zoom Meeting</h5>
            <a className="btn-add" href={redirectLink} style={{textDecoration:"none"}} > Create Meeting </a>
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