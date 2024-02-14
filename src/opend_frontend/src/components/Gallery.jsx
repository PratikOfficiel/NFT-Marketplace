import React, {useState, useEffect} from "react";
import Item from "./Item";
import { opend_backend as opend } from "../../../declarations/opend_backend";
import CURRENT_USER_ID from "../index";
import {Principal} from "@dfinity/principal";

function Gallery() {

  const [userOwnedGallery, setUserOwnedGallery] = useState([]);

  async function getNFTs() {
    const userNFTs = await opend.getOwnedNFTs(CURRENT_USER_ID);
    console.log(userNFTs);
    setUserOwnedGallery(userNFTs);
  }

  useEffect(()=>{
    getNFTs();
  },[])

  return (
    <div className="gallery-view">
      <h3 className="makeStyles-title-99 Typography-h3">My NFTs</h3>
      <div className="disGrid-root disGrid-container disGrid-spacing-xs-2">
        <div className="disGrid-root disGrid-item disGrid-grid-xs-12">
          <div className="disGrid-root disGrid-container disGrid-spacing-xs-5 disGrid-justify-content-xs-center">
          {userOwnedGallery.map((item) => (<Item key={item.toText()} id={item} />))}
          </div>
  {/*<Item id='ahw5u-keaaa-aaaaa-qaaha-cai'/>*/}
        </div>
      </div>
    </div>
  );
}

export default Gallery;
