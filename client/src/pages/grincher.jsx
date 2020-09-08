import React from "react";
import grincherPfp from "../images/grincher.png"

function Grincher() {
  return (
    <div className="home">
      <div className="container" style = {{"display": "flex",flexFlow: "wrap"}}>
        <div className="row align-items-center my-5">
          <div className="col-lg-7">
            <img
              className="img-fluid rounded mb-4 mb-lg-0"
              src={grincherPfp}
              alt=""
            />
          </div>
          <div className="col-lg-5">
            <h1 className="font-weight-light">Grincher</h1>
            <p>
              Grincher is the biggest hacker known on earth.
              he has currently hacked two people!
              his origin story goes way back and paints him out to be a phycological murder
              after he realised that murdering was no longer fun he turned to virtually murdering people using his Ultimate hacking program
              which still has not been unraveled.
              The CIA is still trying to reverse engineer his program to understand how he does this phenomenon. 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Grincher;