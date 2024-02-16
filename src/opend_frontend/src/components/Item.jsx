import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { nft } from "../../../declarations/nft";
import { opend_backend as opend } from "../../../declarations/opend_backend";
import { Actor, HttpAgent} from "@dfinity/agent";
import { idlFactory } from '../../../declarations/nft';
import { idlFactory as tokenIdlFactory} from "../../../declarations/token_backend";
import { Principal } from '@dfinity/principal';
import Button from "./Button";
import CURRENT_USER_ID from "../index";
import PriceLabel from "./PriceLabel";

function Item(props) {

  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [image, setImage] = useState();
  const [button, setButton] = useState();
  const [priceInput, setPriceInput] = useState();
  const [loaderHidden, setLoaderHidden] = useState(true);
  const [blur, setBlur] = useState();
  const [sellStatus, setSellStatus] = useState("");
  const [cost, setCost] = useState();
  const [shouldDisplay, setDisplay] = useState(true);

  const localhost = 'http://localhost:8080/';
  const canisterId = props.id;
  const agent = new HttpAgent({host: localhost});

  let NFTActor;
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

    NFTActor = await Actor.createActor( idlFactory, {
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

    if(props.role==="collection") {const nftIsListed = await opend.isListed(props.id);

      if(nftIsListed) {
        setOwner("OpendD");
        setBlur({filter: "blur(4px)"});
        setSellStatus("Listed");
      } else {
        setButton(<Button handleClick={handleSell} text={"Sell"}/>);
      }
    } 
    else if(props.role==="discover") {

      const originalOwner = await opend.getOriginalOwner(props.id);

      if(originalOwner.toText() !== CURRENT_USER_ID.toText()) {
        setButton(<Button handleClick={handleBuy} text={"Buy"}/>);
      }
      
      const price = await opend.getListedNFTPrice(props.id);

      setCost(price.toString());

    }

  }

  useEffect(()=>{
    loadNFT();
  },[])

  let price;

  function handleSell() {
    setPriceInput(<input
      placeholder="Price in DINOVA"
      type="number"
      className="price-input"
      value={price}
      onChange={(e)=>(price = e.target.value)}
    />)

    setButton(<Button handleClick={sellItem} text={"Confirm"}/>)
  }

  async function sellItem() {
    setLoaderHidden(false);
    try {
      const listingResult = await opend.listItem(props.id, Number(price));
      
      if(listingResult === "Success"){
        const openDId = await opend.getOpenDCanisterID();
        const transferResult = await NFTActor.transferOwnership(openDId);
        console.log("transfer: ",transferResult);
      }
      else{
        console.log("listing was not success");
      }
    } catch (error) {
      console.log("error in Sellitem: ", error);
    }

    setButton();
    setPriceInput();
    setOwner("OpenD");
    setLoaderHidden(true);
    setSellStatus("Listed");
    setBlur({filter:"blur(4px)"});
  }

  async function handleBuy() {

    setLoaderHidden(false);
    const tokenActor = await Actor.createActor(tokenIdlFactory, {
      agent,
      canisterId: Principal.fromText("b77ix-eeaaa-aaaaa-qaada-cai")
    });

    const sellerId = await opend.getOriginalOwner(props.id);
    const itemPrice = await opend.getListedNFTPrice(props.id);

    const result = await tokenActor.transfer(sellerId, itemPrice);

    if(result === "Sucessfull !") {
      const transferResult = await opend.completePurchase(props.id, sellerId, CURRENT_USER_ID);
      console.log("transferResult: ", transferResult);
      setDisplay(false);
    }

    setLoaderHidden(true);
    
  }


  return (
    <div style={{display: shouldDisplay ? "inline": "none"}} className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style={blur}
        />
        <div className="lds-ellipsis" hidden={loaderHidden}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
        <div className="disCardContent-root">
          <PriceLabel sellPrice={cost} />
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"> {sellStatus}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
