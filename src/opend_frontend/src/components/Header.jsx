import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import {Link} from 'react-router-dom';

function Header() {

  return (
    <div className="app-root-1">
      <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
        <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
          <div className="header-left-4"></div>
          <img className="header-logo-11" src={logo} />
          <div className="header-vertical-9"></div>
          <h5 className="Typography-root header-logo-text">NFT Market</h5>
          <div className="header-empty-6"></div>
          <div className="header-space-8"></div>
          <Link to='/discover'>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            Discover
          </button>
          </Link>
          <Link to = 'minter'>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            Minter
          </button>
          </Link>
          <Link to = 'gallery'>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            My NFTs
          </button>
          </Link>
        </div>
      </header>
    </div>
  );
}

export default Header;
