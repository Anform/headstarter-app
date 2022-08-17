import React, {useEffect, useRef, useState} from 'react'
import WebcamContainer from './WebcamContainer';
import './videocall.css'

function VideoCall() {
  const [isLoaded, setIsLoaded] = useState(false);
  let videoRef = useRef();
  const servers = {
    iceServers: [
        {
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
    iceCandidatePoolSize: 10,
    };

  const pc = new RTCPeerConnection(servers);
  const [localStream, setLocalStream] = useState(null);
  let remoteStream = null;

  async function handleWebcam(){
    setLocalStream(await navigator.mediaDevices.getUserMedia({ video: true, audio: true }));
    let remoteStream = new MediaStream();

    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    })
    // Pull tracks from remote stream, add to video stream
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };
  }

  useEffect(()=> {
    videoRef.current.srcObject = localStream;
  }, [localStream])

  const connections = ["test", "test", "test"]

  return (
    <>
    <div className='controls'>
    <button className='webcam-button' onClick={handleWebcam}> Start Webcam </button>
    <button className='create-call-button'> Create a new call </button>
    <button className='join-call-button'> Join a call </button>
    </div>
    <div className='all-webcams'>
    <WebcamContainer stream={videoRef}/>
      {
        connections.map((index)=>(
          <WebcamContainer stream={null}/>
        )) 
      }
    </div>

    
    </>
  )
}

export default VideoCall