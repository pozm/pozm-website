import React, {useCallback, useContext, useState} from 'react';
import InfoBox from '../components/InfoBox';
import userContext from '../hooks/userContext';
import '../styles/InfoBox.css';
import '../styles/utils.css';
import {Button, Icon, Modal, Panel} from "rsuite";

type Props = {};


export const AccountPage: React.FC<Props> = () => {
    let uv = useContext(userContext);
    let [ModalState,ModalStateUpdate] = useState(false)
    let onDelete = useCallback(()=>{
        fetch("/api/account",{method:"DELETE"})
    },[])
    let Close = useCallback(()=>{
        ModalStateUpdate(false)
    },[ModalStateUpdate])
    let Open = useCallback(()=>{
        ModalStateUpdate(true)
    },[ModalStateUpdate])
    return (
        <div className="home">
            <div
                className="jumbotron my-3"
                // style={{ backgroundColor: '#ffffff11' }}
            >
                <h1> Account page </h1>
                <h1 className={"lead"}></h1>
            </div>

            <Modal backdrop="static" show={ModalState} onHide={Close} size="xs">
                <Modal.Body>
                    <Icon
                        icon="remind"
                        style={{
                            color: '#ffb300',
                            fontSize: 24
                        }}
                    />
                    {' \n'}
                    Are you sure you want to delete your account?
                    Once deleted you are unable to recover it.
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={()=>{onDelete(); window.location.reload()}} appearance="primary">
                        Ok
                    </Button>
                    <Button onClick={Close} appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            <Panel header={"Content you have access to"} collapsible bordered shaded>
                <div
                    className="row align-items-center my-5"
                    style={{display: 'flex', justifyContent: 'center'}}
                >
                    <InfoBox linkTo="webhook" title="Webhook" Desc="Manage discord webhooks easily"/>
                    <InfoBox linkTo="TheCollection" title="The collection" Desc="oh yes."/>
                    {(uv?.user?.PowerID ?? 0) >= 5 && <InfoBox linkTo="admin" title="Admin" Desc="The admin panel"/>}
                </div>
            </Panel>
            <Panel className={"my-3"} header={"User info"} collapsible bordered shaded>
                <p className={"font-weight-light"}> Username: {uv?.user?.Username} </p>
                <p className={"font-weight-light"}> Account ID: {uv?.user?.ID} </p>
                <p className={"font-weight-light"}> Power ID: {uv?.user?.PowerID} </p>
                <p className={"font-weight-light"}> Account Email: {uv?.user?.Email} </p>
                <p className={"font-weight-light"}> Created
                    at: {new Date(uv?.user?.RegisteredAT ?? "").toLocaleString("en-gb", {hour12: true})} </p>
                <p className={"font-weight-light"}> Used key: {uv?.user?.KEYID} </p>
                <p className={"font-weight-light"}> Avatar: {uv?.user?.AvatarUri ?? "None"} </p>
            </Panel>
            <div
                className="row align-items-center my-2"
                style={{display: 'flex', justifyContent: 'center'}}
            >
                <Button color={"blue"} href={"https://discord.gg/V4Yvqc"} >
                    Join discord
                </Button>
            </div>
            <div
                className="row align-items-center"
                style={{display: 'flex', justifyContent: 'center'}}
            >
                <Button color={"red"} onClick={Open} >
                    Delete account
                </Button>
            </div>

        </div>
    );
}
export default AccountPage;
