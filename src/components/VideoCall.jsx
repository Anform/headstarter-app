import React, {useRef, useEffect} from 'react';
import ZoomMtgEmbedded from '@zoomus/websdk/embedded';
import './videocall.css'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

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
  var signatureEndpoint = 'https://headstarter-group-zoom-sign.herokuapp.com/'
  // This Sample App has been updated to use SDK App type credentials https://marketplace.zoom.us/docs/guides/build/sdk-app
  var sdkKey = 'Hg458B5SMFNbxhjMIOSsUivexrqX8C3Fssx1'
  var meetingNumber = ''
  var role = 0
  var userName = 'React'
  var userEmail = ''
  var passWord = ''
  // pass in the registrant's token if your meeting or webinar requires registration. More info here:
  // Meetings: https://marketplace.zoom.us/docs/sdk/native-sdks/web/component-view/meetings#join-registered
  // Webinars: https://marketplace.zoom.us/docs/sdk/native-sdks/web/component-view/webinars#join-registered
  var registrantToken = ''

  function getSignature(e) {
    e.preventDefault();
    meetingNumber = zoomIDRef.current.value;
    passWord = zoomPWRef.current.value;

    fetch(signatureEndpoint, {
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
    });

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

  return (
    <div className="App">
      <main>
        <h1>Join a Zoom Meeting</h1>
        {/* For Component View */}
        <div id="meetingSDKElement">
          {/* Zoom Meeting SDK Component View Rendered Here */}
        </div>
        <div>
          <form>
            <label>
              Zoom ID:
             <input type="text" placeholder='Enter Zoom ID' ref={zoomIDRef} required/>
            </label>
            <label>
              Meeting Password:
             <input type="text" placeholder='Enter Password' ref={zoomPWRef} required/>
            </label>
            <input type="submit" onClick={getSignature} value="Join Meeting" />
          </form>
        </div>
      </main>
    </div>
  );
}

export default VideoCall