import { useState, useEffect } from 'react';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css';

export default function TrainingCalendar() {

    // Declaring necessary variables for Calendar functionality

    const localizer = momentLocalizer(moment);

    const [eventsList, setEventsList] = useState([]);
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState('month');

    // Fetching training data for calendar

    useEffect(() => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings')
            .then(response => response.json())
            .then(async trainingData => {

                const trainings = trainingData._embedded.trainings;

                // Creating events for the calendar

                const events = await Promise.all(
                    trainings.map(async training => {
                        try {
                            const res = await fetch(training._links.customer.href);
                            const customer = await res.json();
                            const customerName = `${customer.firstname} ${customer.lastname}`; //Variable with customer's full name parsed

                            return {
                                title: `${training.activity} / ${customerName}`,
                                start: new Date(training.date),
                                end: new Date(moment(training.date).add(training.duration, 'minutes')),
                            };
                        } catch (err) {
                            console.error("Error fetching customer for training:", err);
                            return {
                                title: training.activity,
                                start: new Date(training.date),
                                end: new Date(moment(training.date).add(training.duration, 'minutes')),
                            };
                        }
                    })
                );

                setEventsList(events);
            })
            .catch(err => console.error("Error fetching trainings:", err));

    }, []);

    return (
        <div style={{ height: 500, width: '60vw' }}>

            {/* Rendering the calendar with events and other functionality added */}

            <h2>Training Calendar</h2>
            <Calendar
                localizer={localizer}
                events={eventsList}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                toolbar={true}
                views={['month', 'week', 'day']}
                defaultView='month'
                view={view}
                onView={setView}
                date={date}
                onNavigate={(newDate) => setDate(newDate)}
                popup />
        </div>
    )
}
