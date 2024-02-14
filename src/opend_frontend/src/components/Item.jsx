import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { nft } from "../../../declarations/nft";
import { opend_backend as opend } from "../../../declarations/opend_backend";
import { Actor, HttpAgent} from "@dfinity/agent";
import { idlFactory } from '../../../declarations/nft';
import { Principal } from '@dfinity/principal';

function Item(props) {

  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [image, setImage] = useState();

  const localhost = 'http://localhost:8080/';
  const canisterId = props.id;
  const agent = new HttpAgent({host: localhost});


  async function loadNFT () {

    if (process.env.DFX_NETWORK !== 'ic') {
      await agent.fetchRootKey().catch((err)=>{
        console.warn(
          "Unable to fetch root key. Check to ensure that your local replica is running"
        );
        console.error("something wrong with item file loadnft:", err);
      })
    }

    // console.log((await agent.getPrincipal()).toText());

    const NFTActor = await Actor.createActor( idlFactory, {
      agent,
      canisterId,
    });

    const name = await NFTActor.getName();
    const owner = (await NFTActor.getOwner()).toText();
    const imageData = await NFTActor.getAsset();
    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(
      new Blob([imageContent.buffer], {type: 'image/png'})
    );

    setName(name);
    setOwner(owner);
    setImage(image);

  }

  useEffect(()=>{
    loadNFT();
  },[])
  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
        />
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"></span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Item;
