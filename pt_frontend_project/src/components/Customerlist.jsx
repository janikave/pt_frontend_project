import { useState, useEffect } from "react";
import { AgGridReact } from 'ag-grid-react';

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import AddCustomer from "./Addcustomer";

export default function Customerlist() {

    ModuleRegistry.registerModules([AllCommunityModule]);

    const [listItems, setListItems] = useState([]);

    const [columnDefs] = useState([
        { field: "firstname", headerName: "First Name", sortable: true, filter: true },
        { field: "lastname", headerName: "Last Name", sortable: true, filter: true },
        { field: "streetaddress", headerName: "Street Address", sortable: true, filter: true },
        { field: "postcode", headerName: "Post Code", sortable: true, filter: true },
        { field: "city", sortable: true, filter: true },
        { field: "email", sortable: true, filter: true },
        { field: "phone", sortable: true, filter: true },
    ])

    const [selectedCustomer, setSelectedCustomer] = useState(null);




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

    const getCustomers = () => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers')
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error in fetching customers")
                }
                return response.json();
            })
            .then(customerData => {
                setListItems(customerData._embedded.customers);
            })
            .catch(err => console.error(err));
    };
    

    const deleteCustomer = (url) => {
        fetch(url, {method: 'DELETE'})
            .then(() => getCustomers())
            .catch(err => console.error(err));
    };


    return (
        <div>
            <h2>Customers</h2>

            <AddCustomer getCustomers={getCustomers} deleteCustomer={deleteCustomer} selectedCustomer={selectedCustomer} />

            <div className="ag-theme-alpine" style={{ height: 600, width: "75vw" }}>
                <AgGridReact
                    rowData={listItems}
                    columnDefs={columnDefs}
                    rowSelection="single"
                    onSelectionChanged={params => {
                        const selectedNode = params.api.getSelectedNodes()[0];
                        if (selectedNode) {
                            setSelectedCustomer(selectedNode.data);
                        }
                    }}
                />
            </div>
        </div>
    )
}