import { useState, useEffect } from "react";

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "dayjs";

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

export default function AddTraining( {getTrainings, deleteTraining, selectedTraining} ) {

    const [training, setTraining] = useState({ activity: "", date: null, duration: "", customer: "" })

    const [customers, setCustomers] = useState([])

    useEffect(() => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers')
            .then(res => res.json())
            .then(customerData => setCustomers(customerData._embedded.customers))
            .catch(err => console.error(err));
    }, []);


    const handleChange = (e) => {
        setTraining({ ...training, [e.target.name]: e.target.value });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        const trainingToAdd = { ...training, date: training.date?.toISOString () || ""}
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(trainingToAdd)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to add new a training for a customer")
                }
                alert("Training added to list.")
                setTraining({ activity: "", date: null, duration: "", customer: "" });
                getTrainings();
            })
            .catch(err => console.error(err))
    };



    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack mt={2} direction="row" spacing={2} justifyContent="center" alignItems="center">
                <br />
                <h3>New Training:</h3>
                <TextField name="activity" label="Activity" placeholder="Training activity" value={training.activity} onChange={handleChange} />
                <DateTimePicker name="date" label="Date" placeholder="Date and time for training" value={training.date} onChange={(value) => setTraining({ ...training, date: value })
                } />
                <TextField name="duration" label="Duration" placeholder="Duration for training" value={training.duration} onChange={handleChange} />
                <FormControl style={{ minWidth: 250 }}>
                    <InputLabel id="select-customer">Customer</InputLabel>
                    <Select
                        labelId="select-customer"
                        id="customer"
                        name="customer"
                        value={training.customer}
                        onChange={handleChange}>
                        {customers.map((cust, index) => (
                            <MenuItem key={index} value={cust._links.self.href}>
                                {cust.firstname} {cust.lastname}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" onClick={handleSubmit}>Add</Button> 
                <Button variant="contained" color="error" disabled={!selectedTraining} onClick={() => deleteTraining(selectedTraining._links.self.href)}>Delete</Button> 
            </Stack>
            </LocalizationProvider>
        </div>
    )
}