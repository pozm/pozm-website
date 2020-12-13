import React, {useCallback, useEffect, useState} from "react";
import {Animation, Button, ButtonToolbar, ControlLabel, Form, FormControl, FormGroup, HelpBlock, Panel} from "rsuite";
// import data from "../JSON-Data/h.json"
type Props= {
};

const WebhookT: React.FC<Props> = (props) => {

    let [ValidUrl,setValidUrl] = useState<boolean>(false)
    useEffect(() => {
        setInterval(()=>{setValidUrl(!ValidUrl)},2e3)
    })

    return (
        <div className="home my-5 container" >

            <Panel>

                <Form fluid>
                    <FormGroup>
                        <ControlLabel>URL</ControlLabel>
                        <FormControl name="url" />
                    </FormGroup>

                    <FormGroup>
                        <ButtonToolbar >
                            <Button disabled appearance="primary">Send</Button>
                            <Button disabled appearance="default" color={"yellow"} >Modify</Button>
                        </ButtonToolbar>
                    </FormGroup>
                </Form>

            </Panel>

        </div>
    );
};

export default WebhookT