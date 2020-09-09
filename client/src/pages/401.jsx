import React from "react";
import { withRouter } from "react-router-dom";

function Page401(props) {
    console.log(props)
  return (
    <div className="home">
      <div className="container" style={{display:'flex',flexFlow:'wrap',justifyContent:'center'}}>
        <div className="row align-items-center my-5">
          <div className="col-lg">
            <h1 className="font-weight-light">401</h1>
            <p style={{fontSize:'small'}} >(Unauthorized)</p>
            <div>
                Unfortunately you don't have access to <b> {props.location.pathname}</b>.<br/>
                message : {props.msg || 'No message'} <br/><br/>
                some common reasons/issuses:<br/>
              <ol style={{textAlign:'initial'}}>
                  <li>Simply You are unauthorized</li>
                  <li>You aren't signed in</li>
                  <li>caching issues (clear cache on this website)</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Page401);