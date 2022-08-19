import FullCalender from '@fullcalendar/react'
import { query, onSnapshot, collection, getDocs, updateDoc, doc, addDoc } from "firebase/firestore"
import {db} from "./firebase-config"
import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { UserAuth } from './context/AuthContext'
import timeGridPlugin from '@fullcalendar/timegrid';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./calendar.css"

const FirebaseCalendar = () => {

    const [newEvent, setNewEvent] = useState({tite: "", start: "", end: ""})
    const [noMake, setNoMake ] = useState({tite: "", start: "", end: ""})
    const [data, setData] = useState([])
    const [noData, setNoData] = useState([])
    const dataCollectionRef = collection(db, "dates")
    const notAvailRef = collection(db,"nomake")
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
                        end: doc.get("end").toDate()
                    }
                });
                setData([...array]);
            }
        })
        return unsub
    }, [])
        
    useEffect(() => {
        const q = query(notAvailRef)
        const unsub = onSnapshot(q,(snap) => {
            if(snap.docs) {
                const array = snap.docs.map(doc => {
                    return {
                        id: doc.id,
                        title: doc.get("title"),
                        start:doc.get("start").toDate(),
                        end: doc.get("end").toDate(),
                        backgroundColor: '#A52A2A'
                    }
                });
                setNoData([...array]);
            }
        })
        return unsub
    }, [])


    const handleAddEvent = () => {
        var name
        var canCreate = true
        var cantMake1
        var cantMake2
        var canMake = new Date(newEvent.start).valueOf()
        noData.map((info) => {
            cantMake1 = new Date(info.start).valueOf()
            cantMake2 = new Date(info.end).valueOf()
            if(canMake > cantMake1 && canMake < cantMake2) {
                name = info.title
                canCreate = false
            }
        })
        if(canCreate === true) 
        {
            const event = {
                title: newEvent.title,
                start: newEvent.start,
                end: newEvent.end,
            } 
            addDoc(dataCollectionRef, event)
        }
        else
        {
            window.alert("Event addition failed, " + name + " cant make the meeting")
        }
    
    }


    const handleNotAvail = () => {
        const event = {
            title: noMake.title,
            start: noMake.start,
            end: noMake.end
        } 
        addDoc(notAvailRef, event)
    }

    return (
        
        <div className='wrapper'>
            <div className='calendar'> <h5>Calendar</h5>
            <FullCalender
            eventSources = {[data,noData]}
            plugins = {[timeGridPlugin]}
            displayEventEnd = {true}
            />
            </div>
            <div className='button-area'>
            <div className='buttons'>
                <h5>Input Meeting Time</h5>
                <input type = "text" placeholder = "Add Title..."
                value = {newEvent.title} onChange = {(e) => setNewEvent({...newEvent, title: e.target.value})}/>
                <DatePicker placeholderText="Start Date..."
                selected={newEvent.start} 
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                onChange = {(start) => setNewEvent({...newEvent, start})}/>
                <DatePicker placeholderText="End Date..."
                selected={newEvent.end} onChange = {(end) => setNewEvent({...newEvent, end})}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}/>
                <button className="btn-add" onClick = {handleAddEvent}>Add Event</button>
            </div>
            <div className='buttons'>
                <h5>Detail Not Available Time</h5>
                <input type = "text" placeholder = "Add Name..."
                value = {noMake.title} onChange = {(e) => setNoMake({...noMake, title: e.target.value})}/>
                <DatePicker placeholderText="Start Date..."
                selected={noMake.start} 
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                onChange = {(start) => setNoMake({...noMake, start})}/>
                <DatePicker placeholderText="End Date..."
                selected={noMake.end} onChange = {(end) => setNoMake({...noMake, end})}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}/>
                <button className="btn-add" onClick = {handleNotAvail}>Add Time</button>
            </div>
        </div>
    </div>
    )
}

export default FirebaseCalendar