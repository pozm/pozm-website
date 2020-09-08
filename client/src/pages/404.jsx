import React from "react";

function Page404(props) {
  return (
    <div className="home">
      <div className="container" style={{display:'flex',flexFlow:'wrap',justifyContent:'center'}}>
        <div className="row align-items-center my-5">
          <div className="col-lg">
            <h1 className="font-weight-light">404</h1>
            <div>
              Unfortunately <b> {props.location.pathname} </b> does not exist!<br/>
              This could be due to a few things. <br/><br/>
              <ol style={{textAlign:'initial'}}>
                  <li>Simply the page doesn't exist</li>
                  <li>The page is still in development</li>
                  <li>Not being authorized to access it.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page404;