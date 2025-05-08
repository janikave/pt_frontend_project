import { useState } from "react";

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

export default function AddCustomer({ getCustomers, deleteCustomer, selectedCustomer }) {

    // Determining necessary attributes for customer to add

    const [customer, setCustomer] = useState({ firstname: "", lastname: "", streetaddress: "", postcode: "", city: "", email: "", phone: "" })

    const handleChange = (e) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    // Creating functionality to add the customer to API

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers', {
            method: 'POST', // Choosing the fetch method to add new data
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(customer)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to add new customer");
                }
                alert("Customer added.")

                // Resetting a form and getting a new list after addition is confirmed

                setCustomer({ firstname: "", lastname: "", streetaddress: "", postcode: "", city: "", email: "", phone: "" });
                getCustomers();
            })
            .catch(err => console.error(err))
    };



    return (
        <div>

            {/* Rendering a form to add new customer */}

            <Stack mt={3} direction="row" spacing={1} justifyContent="center" alignItems="center">
                <br />
                <h3>New Customer:</h3>
                <TextField name="firstname" label="First Name" placeholder="First Name" value={customer.firstname} onChange={handleChange} />
                <TextField name="lastname" label="Last Name" placeholder="Last Name" value={customer.lastname} onChange={handleChange} />
                <TextField name="streetaddress" label="Street Address" placeholder="Street Address" value={customer.streetaddress} onChange={handleChange} />
                <TextField name="postcode" label="Post Code" placeholder="Post Code" value={customer.postcode} onChange={handleChange} />
                <TextField name="city" label="City" placeholder="City" value={customer.city} onChange={handleChange} />
                <TextField name="email" label="Email" placeholder="Email" value={customer.email} onChange={handleChange} />
                <TextField name="phone" label="Phone" placeholder="Phone" value={customer.phone} onChange={handleChange} />

                {/* Buttons with Action and Delete -functions */}

                <Button variant="contained" onClick={handleSubmit}>Add</Button>
                <Button variant="contained" color="error" disabled={!selectedCustomer} onClick={() => deleteCustomer(selectedCustomer._links.self.href)}>Delete</Button>
            </Stack>
        </div>
    )
}