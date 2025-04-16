import { useState, useEffect } from "react";
import './Dashboard.css';

function Dashboard() {
    const [timeParts, setTimeParts] = useState({ time: "", ampm: "" });
    const [dateParts, setDateParts] = useState({ day: "", date: "" });

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();

            // TIME
            let hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, "0");
            const ampm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12 || 12;
            setTimeParts({ time: `${hours}:${minutes}`, ampm });

            // DATE
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const [weekday, monthDay, year] = now.toLocaleDateString('en-US', options).split(", ");
            setDateParts({
                day: weekday.toUpperCase(),
                date: `${monthDay}, ${year}`,
            });
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
      }, []);

    return(
        <div className="dashboard-container">
            <div className='progress-bar'>
                <div className='time-date'>
                    <div className='date'>
                        <span className="weekday">{dateParts.day}</span>{" "}
                        <span className="month-day">{dateParts.date}</span>
                    </div>
                    <div className='time'>
                        <span className="time-large">{timeParts.time}</span>
                        <span className="ampm">{timeParts.ampm}</span>
                    </div>
                </div>
            </div>
            <div className='row one'>
                <div className='box one' id='machine-counter'>
                    <div className='label'>Total machines out</div>
                    <div className='total'></div>
                    <div className='buttons'></div>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;
