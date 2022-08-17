import React, {useEffect, useRef} from 'react'
import './videocall.css'


function WebcamContainer({stream}) {
    return (
        <video className="webcam-container" ref={stream} autoPlay playsInline></video>
    )
}

export default WebcamContainer