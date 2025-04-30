import { useState, useEffect } from "react";


function Customerlist() {
    const [listItems, setListItems] = useState([]);

    useEffect(() => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers')
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error in fetch: " + response.statusText)
                }
                return response.json();
            })
            .then(responseData => {
                setListItems(responseData._embedded.customers)
            })
            .catch(err => console.error(err))
    }, []);

    return (
        <div>
            <h3>Customers</h3>
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Street Address</th>
                        <th>Post Code</th>
                        <th>City</th>
                        <th>Email</th>
                        <th>Phone</th>
                    </tr>
                </thead>
                <tbody>
                    {listItems.map((customers) => (
                        <tr key={customers.id}>
                            <th>{customers.firstname}</th>
                            <th>{customers.lastname}</th>
                            <th>{customers.streetaddress}</th>
                            <th>{customers.postcode}</th>
                            <th>{customers.city}</th>
                            <th>{customers.email}</th>
                            <th>{customers.phone}</th>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Customerlist