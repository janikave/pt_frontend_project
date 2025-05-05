import { useState, useEffect, useCallback, useRef } from "react";
import { AgGridReact } from 'ag-grid-react';

import { AllCommunityModule, ModuleRegistry, CsvExportModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { Button } from "@mui/material";

import AddCustomer from "./Addcustomer";

export default function Customerlist() {

    ModuleRegistry.registerModules([AllCommunityModule]);

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

    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const customerGridRef = useRef();


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
        fetch(url, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Deletion failed");
                }
                alert("Customer deleted.");
                getCustomers();
            })
            .catch(err => console.error(err));
    };

    const handleCellEdit = async (params) => {
        const updatedCustomer = params.data;

        try {
            await fetch(updatedCustomer._links.self.href, {
                method: 'PUT',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(updatedCustomer),
            });

            alert("Information updated.");
            getCustomers();
        } catch (err) {
            console.error("Error updating customer info:", err);
            alert('Update failed');
        }
    };

    const exportCustomers = useCallback(() => {
        if (customerGridRef.current) {
            customerGridRef.current.api.exportDataAsCsv();
        }
    }, []);


    return (
        <div>
            <h2>Customers</h2>

            <AddCustomer
                getCustomers={getCustomers}
                deleteCustomer={deleteCustomer}
                selectedCustomer={selectedCustomer}
                exportCustomers={exportCustomers} />
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
                            setSelectedCustomer(selectedNode.data);
                        }
                    }}
                />
            </div>
            <br />
            <Button variant="contained" color="success" onClick={exportCustomers}>Export</Button>
        </div>
    )
}