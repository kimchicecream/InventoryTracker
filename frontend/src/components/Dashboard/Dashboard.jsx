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

    return (
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
            <div className="bento-grid">
                <div className="col-left">
                    <div className="row row-1">
                        <div className="col col-1" id="tile total-machines"></div>
                        <div className="col col-2" id="tile items"></div>
                    </div>
                    <div className="row row-2">
                        <div className="col col-1" id="tile low-stock"></div>
                        <div className="col col-2" id="tile unavailable-items"></div>
                        <div className="col col-3" id="tile total-possible"></div>
                    </div>
                    <div className="row row-3">
                        {/* <div className="subrow subrow-3"></div>
                        <div className="subrow subrow-4"></div> */}
                    </div>
                </div>
                <div className="col-right"></div>
            </div>
        </div>
    );
}

export default Dashboard;
