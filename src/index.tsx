import 'jquery';
import 'popper.js';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import './site.css'

import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import Root from './routes/Root';
import ErrorPage from './routes/ErrorPage';
import Login from './routes/identity/Login';
import Register from './routes/identity/Register';
import Privacy from './routes/Privacy';
import Home from './routes/Home';
import Warehouses from './routes/pages/Warehouses/Warehouses';
import CreateOrEditStorage from './routes/pages/CreateOrEditStorage/CreateOrEditStorage';
import Items from './routes/pages/Items/Items';
import CreateItem from './routes/pages/CreateItem/CreateItem';
import WarehouseInventories from './routes/pages/WarehouseInventories/WarehouseInventories';
import CreateInventory from './routes/pages/CreateInventory/CreateInventory';
import TransactionHistory from './routes/pages/TransactionHistory/TransactionHistory';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            // {
            //     path: "info/",
            //     element: <Info />,
            // },
            {
                path: "login/",
                element: <Login />,
            },
            {
                path: "register/",
                element: <Register />,
            },
            {
                path: "privacy/:id",
                element: <Privacy />,
            },
            {
                path: "warehouses/:id",
                element: <CreateOrEditStorage key='warehouses' storageType="warehouses" />,
            },
            {
                path: "warehouses",
                element: <Warehouses key='warehouses' storageType="warehouses" />,
            },
            {
                path: "stores/:id",
                element: <CreateOrEditStorage key='stores' storageType="stores" />,
            },
            {
                path: "stores",
                element: <Warehouses key='stores' storageType="stores" />,
            },
            {
                path: "createwarehouse",
                element: <CreateOrEditStorage key='warehouses' storageType="warehouses" />,
            },
            {
                path: "createstore",
                element: <CreateOrEditStorage key='stores' storageType="stores" />,
            },
            {
                path: "items",
                element: <Items />,
            },
            {
                path: "createitem",
                element: <CreateItem />,
            },
            {
                path: "items/:id",
                element: <CreateItem />,
            },
            {
                path: "warehousesinventory/:id?",
                element: <WarehouseInventories key='warehouses' storageType="warehouses" />,
            },
            {
                path: "storesinventory/:id?",
                element: <WarehouseInventories key='stores' storageType="stores" />,
            },
            {
                path: "createwarehouseinventory",
                element: <CreateInventory key='warehouses' storageType="warehouses" />,
            },
            {
                path: "createstoreinventory",
                element: <CreateInventory key='stores' storageType="stores" />,
            },
            {
                path: "storeinventory/:id",
                element: <CreateInventory key='stores' storageType="stores" />,
            },
            {
                path: "warehouseinventory/:id",
                element: <CreateInventory key='warehouses' storageType="warehouses" />,
            },
            {
                path: "transactionhistory",
                element: <TransactionHistory key='stores'/>,
            },
        ]
    },
]);


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);