import React, {useCallback, useEffect, useState} from 'react';
import {Link} from "react-router-dom"
import InfoBox from '../components/InfoBox';
import '../styles/InfoBox.css';
import '../styles/utils.css';
import {Alert, Button, Icon, List, Modal, Panel, PanelGroup} from "rsuite";
import {DiscordLinkUrl, parsePowerId} from "../utils";
import useUser from "../hooks/useUser";
import UserFont from "../components/UserFont";
import UserBand from "../components/UserBand";

type Props = {};


export const AccountPage: React.FC<Props> = () => {
    const {user} = useUser()
    let [ModalState, ModalStateUpdate] = useState(false)
    let [Invites, setInvites] = useState<{KEYID:string, Registered:number}[]>([])

    useEffect(()=>{
        fetch("/api/Keys/CreatedInvites", {method: "GET"}).then(v => {
            return v.json()
        }).then(jsn=>{
            if (jsn.error) {
                return setInvites([])
            }
            return setInvites(jsn.Keys)
        })
    },[setInvites])
    let onDelete = useCallback(() => {
        fetch("/api/account", {method: "DELETE"}).then(v => {
            if (v.ok) {
                window.location.reload()
            }
        })
    }, [])
    let CreateInvite = useCallback(()=>{
        fetch("/api/Keys/CreateInvite", {method: "POST"}).then(v => {
            return v.json()
        }).then(jsn=>{
            if (jsn.error) {
                return Alert.error( <div> {jsn.message} </div> )
            }
            user!.CreatedInvites!++
            return setInvites([...Invites,{KEYID:jsn.Key,Registered:0}])
        })
    },[setInvites,Invites,user])

    let Close = useCallback(() => {
        ModalStateUpdate(false)
    }, [ModalStateUpdate])
    let Open = useCallback(() => {
        ModalStateUpdate(true)
    }, [ModalStateUpdate])
    return (
        <div className="home">
            <UserBand user={user!} desc={<>
                <p style={{fontSize: "medium"}}> {user?.DiscordUser && user?.DiscordUser + ' • '} <UserFont user={user}> {parsePowerId(user?.PowerID ?? 0)} </UserFont> • <Link
                    to={"/user/" + user?.ID}>Goto profile</Link></p>
            </>} />

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
                    <Button onClick={() => {
                        onDelete()
                    }} appearance="primary">
                        Ok
                    </Button>
                    <Button onClick={Close} appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            <PanelGroup accordion>
                <Panel header={"Content you have access to"} eventKey={1} collapsible bordered>
                    <div
                        className="row align-items-center my-5"
                        style={{display: 'flex', justifyContent: 'center'}}
                    >
                        <InfoBox linkTo="webhook" title="Webhook" Desc="Manage discord webhooks easily"/>
                        <InfoBox linkTo="TheCollection" title="The collection" Desc="oh yes."/>
                        {(user?.PowerID ?? 0) >= 5 && <InfoBox linkTo="admin" title="Admin" Desc="The admin panel"/>}
                    </div>
                </Panel>
                <Panel className={"my-3"} header={"User info"} eventKey={2} collapsible bordered>
                    <p className={"font-weight-light"}> Username: {user?.Username} </p>
                    <p className={"font-weight-light"}> Account ID: {user?.ID} </p>
                    <p className={"font-weight-light"}> Power ID: {user?.PowerID} </p>
                    <p className={"font-weight-light"}> Account Email: {user?.Email} </p>
                    <p className={"font-weight-light"}> Created
                        at: {new Date(user?.RegisteredAT ?? "").toLocaleString("en-gb", {hour12: true})} </p>
                    <p className={"font-weight-light"}> Used key: {user?.KEYID} </p>
                    <p className={"font-weight-light"}> Linked discord: {user?.DiscordUser} ({user?.DiscordID}) </p>
                    <p className={"font-weight-light"}> Avatar: {user?.AvatarUri ?? "None"} </p>
                </Panel>
                <Panel className={"my-3"} header={"Invites"} eventKey={3} collapsible bordered>
                    <Button color={"orange"} onClick={CreateInvite} disabled={((user?.CreatedInvites ?? 99) >= 2) && user?.ID !== 2 } >
                        Create invite
                    </Button>
                    <List bordered hover className={"my-2"} >

                        {Invites?.map((v,idx)=>{
                            return <List.Item key={idx+v.KEYID}  >{!v.Registered && '✨ | '}<span className={"reqh"} >{v.KEYID}</span></List.Item>
                        })}


                    </List>
                </Panel>
            </PanelGroup>
            <div
                className="row align-items-center my-2"
                style={{display: 'flex', justifyContent: 'center'}}
            >
                <Button color={"blue"} href={DiscordLinkUrl}>
                    Link discord {user?.DiscordUser && `(Currently linked to ${user?.DiscordUser ?? "????"})`}
                </Button>
            </div>
            <div
                className="row align-items-center"
                style={{display: 'flex', justifyContent: 'center'}}
            >
                <Button color={"red"} onClick={Open}>
                    Delete account
                </Button>
            </div>

        </div>
    );
}
export default AccountPage;
