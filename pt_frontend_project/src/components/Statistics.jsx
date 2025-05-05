import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function StatisticGraph() {

    const [trainings, setTrainings] = useState([]);

    useEffect(() => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings')
            .then(response => response.json())
            .then(trainingData => {

                const trainings = trainingData._embedded.trainings;

                const activityMap = {};

                trainings.forEach(training => {
                    const activity = training.activity;
                    const duration = training.duration;

                    if (activityMap[activity]) {
                        activityMap[activity] += duration;
                    } else {
                        activityMap[activity] = duration;
                    }
                });

                const graphData = Object.entries(activityMap).map(([activity, duration]) => ({
                    activity, duration
                }));

                setTrainings(graphData);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div style={{width: '65vw', height:500}}>
            <ResponsiveContainer>
                <BarChart data={trainings} >
                <CartesianGrid  strokeDasharray="3 3"/>
                <XAxis dataKey="activity" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="duration" fill="#05445e" name="Duration (minutes)" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}