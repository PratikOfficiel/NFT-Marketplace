import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Minter from './components/Minter';
import Gallery from './components/Gallery';
import Discover from './components/Discover';
import {Principal} from "@dfinity/principal";

import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route exact path='/' element = {<App/>} >
            <Route path='/discover' element={<Discover/>}/>
            <Route path='/gallery' element={<Gallery/>}/>
            <Route path='/minter' element={<Minter />}/>
        </Route>
    )
)

const CURRENT_USER_ID = Principal.fromText("2vxsx-fae");
export default CURRENT_USER_ID

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router = {router} />
);
