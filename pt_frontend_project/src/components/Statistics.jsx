import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TrainingGraph() {

    const [trainings, setTrainings] = useState([]);

    // Fetching needed training data for the graph (activity and minutes) 

    useEffect(() => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings')
            .then(response => response.json())
            .then(trainingData => {

                const trainings = trainingData._embedded.trainings;

                // Creating a map for activities and counting minutes for every activity

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
        <div style={{ width: '65vw', height: 500 }}>

            {/* Rendering the bar graph for the data */}

            <h2>Training types in minutes</h2>
            <ResponsiveContainer>
                <BarChart data={trainings} >
                    <CartesianGrid strokeDasharray="3 3" />
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