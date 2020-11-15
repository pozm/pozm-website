import React from "react";
import {Message} from "rsuite";
// import data from "../JSON-Data/h.json"
type Props= {
};


export const webhookT: React.FC<Props> = (props) => {
    return (
        <div className="home">
            <div className="container" style={{
                flexFlow: "wrap",
                justifyContent: "center",
            }}>
                <Message type={"warning"} title={"This is being revamped"} description={"come back when finished"}/>
            </div>
        </div>
    );
}

export default webhookT