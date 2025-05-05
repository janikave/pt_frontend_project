import { useState, useEffect, useRef } from "react";
import { AgGridReact } from 'ag-grid-react';
import dayjs from 'dayjs'

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import AddTraining from "./Addtraining";
import { Button } from "@mui/material";


export default function Traininglist() {

    ModuleRegistry.registerModules([AllCommunityModule]);

    const [listItems, setListItems] = useState([]);

    const [columnDefs] = useState([
        { field: "activity", sortable: true, filter: true },
        { field: "date", sortable: true, filter: true, valueFormatter: params => dayjs(params.value).format('DD.MM.YYYY HH:mm') },
        { field: "duration", sortable: true, filter: true },
        { field: "customerName", headerName: "Customer", sortable: true, filter: true}
    ])

    const trainingGridRef = useRef();

    const [selectedTraining, setSelectedTraining] = useState(null);

    useEffect(() => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings')
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error in fetch: " + response.statusText)
                }
                return response.json();
            })
            .then( async trainingData => {
                const trainings = trainingData._embedded.trainings;

                const CustomerTraining = await Promise.all(
                    trainings.map(async training => {
                        const customerUrl = training._links.customer.href;

                        try {
                            const customerRest = await fetch(customerUrl);
                            const customerData = await customerRest.json();
                            const customerName = `${customerData.firstname} ${customerData.lastname}`

                            return {
                                ... training, customerName: customerName
                            };
                        }
                        catch (err) {
                            console.error("Error fetching the customer", err);

                            return {
                                ...training, customerName: "unknonwn"
                            };
                        }
                    })
                );

                setListItems(CustomerTraining)
            })
            .catch(err => console.error(err))
    }, []);

    const getTrainings = () => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings')
            .then(response => response.json())
            .then(async trainingData => {
                const trainings = trainingData._embedded.trainings;

                const updateTrainings = await Promise.all(
                    trainings.map(async training => {
                        try {
                            const res = await fetch(training._links.customer.href);
                            const cust = await res.json();
                            return {...training, customerName: `${cust.firstname} ${cust.lastname}` };
                        } catch (err) {
                            return {... training, customerName: "unknown"}
                        }
                    })
                );
                setListItems(updateTrainings)
            })
            .catch(err => console.error(err));
    }

        useEffect(() => {
            getTrainings();
        }, []);

        const deleteTraining = (url) => {
            fetch(url, {method: 'DELETE'})
                .then (response => {
                    if (!response.ok) {
                        throw new Error("Deletion failed");
                    }
                    alert("Training deleted.");
                    getTrainings();
                })
                .catch(err => console.error(err));
        };
        
    return (
        <div>
            <h2>Training Schedule</h2>

            <AddTraining 
            getTrainings={getTrainings}
            deleteTraining={deleteTraining}
            selectedTraining={selectedTraining} />

            <div className="ag-theme-alpine" style={{ height: 600, width: "50vw" }}>
                <AgGridReact
                    ref={trainingGridRef}
                    rowData={listItems}
                    columnDefs={columnDefs}
                    rowSelection="single"
                    onSelectionChanged={params => {
                        const selectedNode = params.api.getSelectedNodes()[0];
                        if (selectedNode) {
                            setSelectedTraining(selectedNode.data);
                        }
                    }}
                />
            </div>
        </div>
    )
}