import React from "react";
import { useLocation } from "react-router-dom";
import data from "../JSON-Data/h.json"
type Props= {
};


export const TheCollection: React.FC<Props> = (props) => {
  let loc = useLocation()
  return (
    <div className="home">
      <div className="container" style={{display:'flex',flexFlow:'wrap',justifyContent:'center'}}>
        <div className="row align-items-center my-5">
          <div className="col-lg">
              hi
          </div>
        </div>
      </div>
    </div>
  );
}

export default TheCollection