import { useState, useEffect } from 'react';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css';

export default function TrainingCalendar() {

    const localizer = momentLocalizer(moment);
    
    const [eventsList, setEventsList] = useState([]);
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState('month');

    useEffect(() => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings')
            .then(response => response.json())
            .then(async trainingData => {

                const trainings = trainingData._embedded.trainings;

                const events = await Promise.all(
                    trainings.map(async training => {
                        try {
                            const res = await fetch(training._links.customer.href);
                            const customer = await res.json();
                            const customerName = `${customer.firstname} ${customer.lastname}`;

                            return {
                                title: `${training.activity} / ${customerName}`,
                                start: new Date(training.date),
                                end: new Date(moment(training.date).add(training.duration, 'minutes')),
                            };
                        } catch (err) {
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
            .catch(err => console.error(err));

    }, []);

    return (
        <div style={{ height: 500, width: '60vw' }}>
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
