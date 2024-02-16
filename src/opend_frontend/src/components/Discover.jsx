import React, {useState, useEffect} from 'react'
import Item from "./Item";

import { opend_backend as opend } from '../../../declarations/opend_backend';

function Discover() {
  const [listingGallery, setListingGallery] = useState([]);

  async function getNFTs() {
   
    const listedNFTIds = await opend.getListedNFTs();
    setListingGallery(listedNFTIds);
  }

  useEffect(()=>{
    getNFTs();
  },[])

  return (
    <div className="gallery-view">
      <h3 className="makeStyles-title-99 Typography-h3">Discover</h3>
      <div className="disGrid-root disGrid-container disGrid-spacing-xs-2">
        <div className="disGrid-root disGrid-item disGrid-grid-xs-12">
          <div className="disGrid-root disGrid-container disGrid-spacing-xs-5 disGrid-justify-content-xs-center">
          {listingGallery.map((item) => (<Item key={item.toText()} id={item} role="discover"/>))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Discover