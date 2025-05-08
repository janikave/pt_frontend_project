import { useState, useEffect, useCallback, useRef } from "react";
import { AgGridReact } from 'ag-grid-react';

import { AllCommunityModule, ModuleRegistry, CsvExportModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-theme-alpine.css';


import { Button } from "@mui/material";

import AddCustomer from "./Addcustomer";

export default function Customerlist() {

    ModuleRegistry.registerModules([AllCommunityModule]);

    // Creating necessary variables for the list 

    const [listItems, setListItems] = useState([]);

    const [columnDefs] = useState([
        { field: "firstname", headerName: "First Name", sortable: true, filter: true, editable: true },
        { field: "lastname", headerName: "Last Name", sortable: true, filter: true, editable: true },
        { field: "streetaddress", headerName: "Street Address", sortable: true, filter: true, editable: true },
        { field: "postcode", headerName: "Post Code", sortable: true, filter: true, editable: true },
        { field: "city", sortable: true, filter: true, editable: true },
        { field: "email", sortable: true, filter: true, editable: true },
        { field: "phone", sortable: true, filter: true, editable: true }
    ])

    // Variables for selecting a row from the list

    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const customerGridRef = useRef();

    useEffect(() => {
        getCustomers();
    }, []);

    // Fetching the customers data

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
            .catch(err => console.error("Failed to fetch trainings:", err));
    };


    // Fetching the customer for deletion

    const deleteCustomer = (url) => {
        fetch(url, { method: 'DELETE' }) // Choosing the fetch method to delete data
            .then(response => {
                if (!response.ok) {
                    throw new Error("Deletion failed"); // Error message if no response
                }
                alert("Customer deleted.");

                getCustomers(); // Updating the list after confirmation
            })
            .catch(err => console.error(err));
    };

    // Edit functionality for the list 

    const handleCellEdit = async (params) => {
        const updatedCustomer = params.data;

        try {
            await fetch(updatedCustomer._links.self.href, {
                method: 'PUT', // Choosing the fetch method to update data
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(updatedCustomer),
            });

            alert("Information updated.");

            getCustomers(); // Updating the list after confirmation
        } catch (err) {
            console.error("Error updating customer info:", err);
            alert('Update failed');
        }
    };

    // Exporting customer data for a CSV file */}

    const exportCustomers = useCallback(() => {
        if (customerGridRef.current) {
            customerGridRef.current.api.exportDataAsCsv();
        }
    }, []);


    return (
        <div>

            <h2>Customers</h2>

            {/* Calling Add-component with necessary functions for the list */}

            <AddCustomer
                getCustomers={getCustomers}
                deleteCustomer={deleteCustomer}
                selectedCustomer={selectedCustomer}
                exportCustomers={exportCustomers} />

            {/* Rendering the list of customers and the export button */}

            <div className="ag-theme-alpine" style={{ height: 500, width: "75vw" }}>
                <AgGridReact
                    ref={customerGridRef}
                    rowData={listItems}
                    columnDefs={columnDefs}
                    rowSelection="single"
                    onCellValueChanged={handleCellEdit}
                    onSelectionChanged={params => {
                        const selectedNode = params.api.getSelectedNodes()[0];
                        if (selectedNode) {
                            setSelectedCustomer(selectedNode.data); //Setting customer as selected after you click the row
                        }
                    }}
                />
            </div>
            <br />
            <Button variant="contained" color="success" onClick={exportCustomers}>Export</Button>
        </div>
    )
}