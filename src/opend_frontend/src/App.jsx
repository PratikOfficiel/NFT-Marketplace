import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import { Outlet } from 'react-router-dom';
import homeImage from "../assets/home-img.png";
import Item from "./components/Item";
import Minter from "./components/Minter";

function App() {

  return (
    <div className="App">
      <Header />
      <Outlet/>
      <Footer />
    </div>
  );
}

export default App;
