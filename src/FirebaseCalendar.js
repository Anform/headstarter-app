import FullCalender from '@fullcalendar/react'
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from '@fullcalendar/interaction'
import { query, onSnapshot, collection, getDocs, updateDoc, doc, addDoc } from "firebase/firestore"
import {db} from "./firebase-config"
import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { UserAuth } from './context/AuthContext'
const FirebaseCalendar = () => {

    const [data, setData] = useState([])
    const dataCollectionRef = collection(db, "dates")
    const navigate = useNavigate()
    const {user} = UserAuth()

    useEffect(() => {
        if(!user) {
            navigate("/")
        }
    }, [user])

    useEffect(() => {
        const q = query(dataCollectionRef)
        const unsub = onSnapshot(q,(snap) => {
            if(snap.docs) {
                const array = snap.docs.map(doc => {
                    return {
                        id: doc.id,
                        title: doc.get("title"),
                        start:doc.get("start").toDate(),
                        allDay:doc.get('allDay')
                    }
                });
                setData([...array]);
            }
        })
        return unsub
    }, [])
        

    const handleDateClick = (e) => {
        if(e.jsEvent.altKey) {
            const title = prompt("Enter title", e.dateStr)
            const test = prompt("just testing something")
            const event = {
                title: title ? title : e.dateStr,
                start: e.date,
                allDay: true
            }
            addDoc(dataCollectionRef, event)
        }
    }

    return (
        <div>
        <FullCalender 
        events = {data}
        plugins = {[dayGridPlugin, interactionPlugin]}
        dateClick = {handleDateClick}
        />
        </div>
    )
}

export default FirebaseCalendar