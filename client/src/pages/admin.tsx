import React, {useCallback, useMemo, useState} from "react";
import {Alert, Button, Icon, IconButton, InputNumber, Modal, Panel, PanelGroup} from "rsuite";
import {AdminData} from "../types/adminTypes";
import useUser from "../hooks/useUser";

type Props = {};


const AdminPage: React.FC<Props> = () => {

    let [data, setData] = useState<AdminData.RootObject | null>(null)
    const {user} = useUser()
    let [ModalState, ModalStateUpdate] = useState({s: false, k: 0,user:false})
    let [KnownPower, KnownPowerUpdate] = useState(0)

    const UpdateData = useCallback(() => {
        fetch('/api/adminData').then(txt => {
            txt.json().then(jsn => {
                setData(jsn)
            })
        })
    }, [])
    useMemo(() => {
        UpdateData()
    }, [UpdateData])


    let Close = useCallback(() => {
        ModalStateUpdate({...ModalState, s: false, user:false})
    }, [ModalStateUpdate,ModalState])
    let Open = useCallback((k) => {
        ModalStateUpdate({...ModalState, s: true, k, user:false})
    }, [ModalStateUpdate,ModalState])
    let OpenU = useCallback((k) => {
        ModalStateUpdate({...ModalState, s: true, k, user:true})
    }, [ModalStateUpdate,ModalState])

    const DeleteAccount = useCallback((target) => {
        fetch('/api/account', {
            method: "DELETE",
            body: JSON.stringify({target})
        }).then(resp => resp.json().then(jsn => {
            if (!jsn.error) {
                Alert.success(jsn.message)
                if (!data) return
                let newUsers = data.users.filter((value: AdminData.User) => value.ID !== target)
                setData({...data, users: newUsers})
            } else {
                Alert.error(jsn.message)
            }
        }), () => Alert.error("Unable to fetch"))
    }, [data, setData])
    const DeleteKey = useCallback((Key) => {
        fetch('/api/Keys/DeleteKey', {
            method: "DELETE",
            body: JSON.stringify({Key})
        }).then(resp => resp.json().then(jsn => {
            if (!jsn.error) {
                Alert.success(jsn.message)
                if (!data) return
                let newKeys = data.Keys.filter((value: AdminData.Key) => value.KEYID !== Key)
                setData({...data, Keys: newKeys})
            } else {
                Alert.error(jsn.message)
            }
        }), () => Alert.error("Unable to fetch"))
    }, [data, setData])
    const UpdateUser = useCallback((User) => {
        fetch(`/api/user/`+User, {
            method: "PUT",
            body: JSON.stringify({power: KnownPower})
        }).then(resp => resp.json().then(jsn => {
            if (!jsn.error) {
                Alert.success(jsn.message)
                if (!data) return
                let newUsers = data.users.map(value => value.ID === User ? {...value, PowerID: KnownPower} : value)
                setData({...data, users: newUsers})
                Close()
            } else {
                Alert.error(jsn.message)
            }
        }), () => Alert.error("Unable to fetch"))
    }, [data, setData, KnownPower, Close])
    const Updatekey = useCallback((Key) => {
        fetch('/api/Keys/ModifyKey', {
            method: "PUT",
            body: JSON.stringify({Key, Power: KnownPower})
        }).then(resp => resp.json().then(jsn => {
            if (!jsn.error) {
                Alert.success(jsn.message)
                if (!data) return
                let newKeys = data.Keys.map(value => value.KEYID === Key ? {...value, PowerID: KnownPower} : value)
                setData({...data, Keys: newKeys})
                Close()
            } else {
                Alert.error(jsn.message)
            }
        }), () => Alert.error("Unable to fetch"))
    }, [data, setData, KnownPower, Close])
    const CreateKey = useCallback(() => {
        fetch('/api/Keys/CreateKey', {
            method: "Post",
        }).then(resp => resp.json().then(jsn => {
            if (!jsn.error) {
                Alert.success(jsn.message)
                // if (!data) return
                UpdateData()
            } else {
                Alert.error(jsn.message)
            }
        }), () => Alert.error("Unable to fetch"))
    }, [UpdateData])

    let renderUOb = useCallback((val: AdminData.User) => {

        return (
            <Panel key={val.ID} bordered header={val.Username}
                   style={{textAlign: "justify", display: "flex", justifyContent: "start", flexFlow: "column"}}>
                <IconButton style={{display: "flex", float: "right"}} onClick={() => DeleteAccount(val.ID)}
                            icon={<Icon icon="close"/>} color="red" disabled={(val.PowerID >= (user?.PowerID ?? 0)) }
                            circle/>
                <IconButton style={{display: "flex", float: "right"}} className={"mx-1"} onClick={() => {
                    KnownPowerUpdate(val.PowerID)
                    OpenU(val.ID)
                }} icon={<Icon icon="minus"/>} color="orange" disabled={val.ID === 2 /*val.PowerID >= (user?.PowerID ?? 0)*/} circle/>
                <p className={"font-weight-light"}> Account ID: {val.ID} </p>
                <p className={"font-weight-light"}> Power ID: {val.PowerID} </p>
                <p className={"font-weight-light"}> Account Email: {val.Email} </p>
                <p className={"font-weight-light"}> Created
                    at: {new Date(val.RegisteredAT).toLocaleString("en-gb", {hour12: true})} </p>
                <p className={"font-weight-light"}> Linked discord: {val.DiscordUser} ({val.DiscordID}) </p>
                <p className={"font-weight-light"}> Used key: {val.KEYID} </p>
                <p className={"font-weight-light"}> Invited By: {val.InvitedBy} </p>
            </Panel>);
    }, [DeleteAccount,user?.PowerID,OpenU])
    let renderKOb = useCallback((val: AdminData.Key) => {

        return (
            <Panel key={val.KEYID} bordered header={`${!val.Registered ? "⭐" : ""}${val.KEYID}`}
                   style={{textAlign: "justify", display: "flex", justifyContent: "start", flexFlow: "column"}}>
                <IconButton style={{display: "flex", float: "right"}} onClick={() => DeleteKey(val.KEYID)}
                            icon={<Icon icon="close"/>} color="red" disabled={Boolean(val.Registered ?? false)} circle/>
                <IconButton style={{display: "flex", float: "right"}} className={"mx-1"} onClick={() => {
                    KnownPowerUpdate(val.PowerID)
                    Open(val.KEYID)
                }} icon={<Icon icon="minus"/>} color="orange" disabled={Boolean(val.Registered ?? false)} circle/>
                <p className={"font-weight-light"}> Created at: {val.CreatedAT} </p>
                <p className={"font-weight-light"}> Power ID: {val.PowerID} </p>
                <p className={"font-weight-light"}> Is registered?: {val.Registered} </p>
                <p className={"font-weight-light"}> Created By: {val.CreatedBy} </p>
                <p className={"font-weight-light"}> Registered
                    at: {new Date(val.RegisteredAT ?? 0).toLocaleString("en-gb", {hour12: true})} </p>
                {!val.Registered && <Button
                    onClick={() => window.navigator.clipboard.writeText("http://" + window.location.hostname + "/signup?key=" + val.KEYID)}> Copy
                    signup code </Button>}
            </Panel>);
    }, [Open, DeleteKey])

    return (

        <div className="home">
            <Modal backdrop="static" show={ModalState.s} onHide={Close} size="xs">
                <Modal.Body>
                    <h3>Modification to power id</h3>
                    <InputNumber min={0} max={4} value={KnownPower}
                                 onChange={(newval) => KnownPowerUpdate(Number(newval))}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => {
                        if (!ModalState.user) Updatekey(ModalState.k); else UpdateUser(ModalState.k)
                    }} appearance="primary">
                        Ok
                    </Button>
                    <Button onClick={Close} appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="container my-2">
                <h1>Users</h1>
                <PanelGroup accordion bordered>
                    {data?.users.map(renderUOb)}
                </PanelGroup>
                <h1>Keys</h1>
                <PanelGroup accordion bordered>
                    <IconButton className={"my-1"} style={{marginLeft: "auto", marginRight: ".25rem", display: "flex"}}
                                onClick={CreateKey} icon={<Icon icon="plus"/>} color="green" circle/>
                    {data?.Keys.map(renderKOb)}
                </PanelGroup>
            </div>
        </div>

    )
}

export default AdminPage