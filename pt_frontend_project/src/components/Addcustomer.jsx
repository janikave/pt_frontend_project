import { useState } from "react";

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

export default function AddCustomer() {

    const [customer, setCustomer] = useState({ firstname: "", lastname: "", streetaddress: "", postcode: "", city: "", email: "", phone: "" })

    const handleChange = (e) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(customer)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to add new customer");
                }
                alert("Customer added.")
                setCustomer({ firstname: "", lastname: "", streetaddress: "", postcode: "", city: "", email: "", phone: "" });
            })
            .catch(err => console.error(err))
    };



    return (
        <div>
            <Stack mt={1} direction="row" spacing={1} justifyContent="center" alignItems="center">
                <br />
                <h3>New Customer:</h3>
                <TextField name="firstname" label="First Name" placeholder="First Name" value={customer.firstname} onChange={handleChange} />
                <TextField name="lastname" label="Last Name" placeholder="Last Name" value={customer.lastname} onChange={handleChange} />
                <TextField name="streetaddress" label="Street Address" placeholder="Street Address" value={customer.streetaddress} onChange={handleChange} />
                <TextField name="postcode" label="Post Code" placeholder="Post Code" value={customer.postcode} onChange={handleChange} />
                <TextField name="city" label="City" placeholder="City" value={customer.city} onChange={handleChange} />
                <TextField name="email" label="Email" placeholder="Email" value={customer.email} onChange={handleChange} />
                <TextField name="phone" label="Phone" placeholder="Phone" value={customer.phone} onChange={handleChange} />
                <Button variant="contained" onClick={handleSubmit}>Add</Button>
            </Stack>
        </div>
    )
}