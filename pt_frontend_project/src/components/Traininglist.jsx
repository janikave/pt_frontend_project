import { useState, useEffect } from "react";
import { AgGridReact } from 'ag-grid-react';
import dayjs from 'dayjs'

import { AllCommunityModule, ModuleRegistry} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-theme-alpine.css';

function Traininglist() {

    ModuleRegistry.registerModules([AllCommunityModule]);

    const [listItems, setListItems] = useState([]);

    const [columnDefs] = useState([
        { field: "activity", sortable: true, filter: true },
        { field: "date", sortable: true, filter: true, valueFormatter: params => dayjs(params.value).format('DD.MM.YYYY HH:mm') },
        { field: "duration", sortable: true, filter: true }
    ])

    useEffect(() => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings')
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error in fetch: " + response.statusText)
                }
                return response.json();
            })
            .then(responseData => {
                setListItems(responseData._embedded.trainings)
            })
            .catch(err => console.error(err))
    }, []);

    console.log(listItems)

    return (
        <div>
            <h2>Training Schedule</h2>
            <div className="ag-theme-alpine" style={{ height: 600, width: 650 }}>
                <AgGridReact
                    rowData={listItems}
                    columnDefs={columnDefs}
                />
            </div>
        </div>
    )
}

export default Traininglist