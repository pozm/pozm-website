import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {Alert, Button, Icon, IconButton, Modal, Panel, PanelGroup} from "rsuite";
import  { AdminData } from "../types/adminTypes";
import userContext from "../hooks/userContext";
type Props= {

};


const AdminPage: React.FC<Props> = () => {

    let [data,setData] = useState<AdminData.RootObject|null>( null )
    let UserContext = useContext(userContext)
    let [ModalState,ModalStateUpdate] = useState(false)
    let [KnownPower,KnownPowerUpdate] = useState(0)

    const UpdateData = useCallback(()=>{
        fetch('/api/adminData').then(txt=>{
            txt.json().then(jsn=>{
                setData(jsn)
            })
        })
    },[])
    useMemo(()=>{
        UpdateData()
    }, [])
    const DeleteAccount = useCallback((target)=>{
        fetch('/api/account',{
            method:"DELETE",
            body: JSON.stringify({target})
        }).then(resp=>resp.json().then(jsn=>{
            if (!jsn.error)
            {
                Alert.success(jsn.message)
                if (!data) return
                let newUsers = data.users.filter((value : AdminData.User) => value.ID != target )
                setData({...data,users:newUsers})
            }
            else {
                Alert.error(jsn.message)
            }
        }),()=>Alert.error("Unable to fetch"))
    },[data,setData])
    const DeleteKey = useCallback((Key)=>{
        fetch('/api/DeleteKey',{
            method:"DELETE",
            body: JSON.stringify({Key})
        }).then(resp=>resp.json().then(jsn=>{
            if (!jsn.error)
            {
                Alert.success(jsn.message)
                if (!data) return
                let newKeys= data.Keys.filter((value : AdminData.Key) => value.KEYID != Key )
                setData({...data,Keys:newKeys})
            }
            else {
                Alert.error(jsn.message)
            }
        }),()=>Alert.error("Unable to fetch"))
    },[data,setData])
    const CreateKey = useCallback(()=>{
        fetch('/api/CreateKey',{
            method:"Post",
        }).then(resp=>resp.json().then(jsn=>{
            if (!jsn.error)
            {
                Alert.success(jsn.message)
                // if (!data) return
                UpdateData()
            }
            else {
                Alert.error(jsn.message)
            }
        }),()=>Alert.error("Unable to fetch"))
    },[])

    let Close = useCallback(()=>{
        ModalStateUpdate(false)
    },[ModalStateUpdate])
    let Open = useCallback(()=>{
        ModalStateUpdate(true)
    },[ModalStateUpdate])

    let renderUOb = useCallback((val:AdminData.User)=>{

        return (
            <Panel key={val.ID} bordered header={val.Username} style={{ textAlign:"justify", display:"flex", justifyContent: "start", flexFlow: "column"}}>
                <IconButton style={{display:"flex",float:"right"}} onClick={()=>DeleteAccount(val.ID)} icon={<Icon icon="close"/>} color="red" disabled={val.PowerID >= (UserContext?.user?.PowerID ?? 0)} circle/>
                <p className={"font-weight-light"} > Account ID: {val.ID} </p>
                <p className={"font-weight-light"} > Power ID: {val.PowerID} </p>
                <p className={"font-weight-light"} > Account Email: {val.Email} </p>
                <p className={"font-weight-light"} > Created at: {new Date(val.RegisteredAT).toLocaleString("en-gb",{hour12:true})} </p>
                <p className={"font-weight-light"} > Used key: {val.KEYID} </p>
            </Panel>);
    },[data])
    let renderKOb = useCallback((val:AdminData.Key)=>{

        return (
            <Panel key={val.KEYID} bordered  header={ `${!val.Registered ? "⭐" : ""}${val.KEYID}`}  style={{ textAlign:"justify", display:"flex", justifyContent: "start", flexFlow: "column"}}>
                <IconButton style={{display:"flex",float:"right"}} onClick={()=>DeleteKey(val.KEYID)} icon={<Icon icon="close"/>} color="red" disabled={Boolean(val.Registered ?? false)} circle/>
                <IconButton style={{display:"flex",float:"right"}} className={"mx-1"} onClick={()=>Open()} icon={<Icon icon="minus"/>} color="orange" disabled={Boolean(val.Registered ?? false)} circle/>
                <p className={"font-weight-light"} > Created at: {val.CreatedAT} </p>
                <p className={"font-weight-light"} > Power ID: {val.PowerID} </p>
                <p className={"font-weight-light"} > Is registered?: {val.Registered} </p>
                <p className={"font-weight-light"} > Registered at: {new Date(val.RegisteredAT ?? 0).toLocaleString("en-gb",{hour12:true})} </p>
            </Panel>);
    },[data])

return (

    <div className="home">
        <Modal backdrop="static" show={ModalState} onHide={Close} size="xs">
            <Modal.Body>
                <h3>Modification to power id</h3>
                <input type={"number"} />
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={()=>{}} appearance="primary">
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
                <IconButton className={"my-1"} style={{marginLeft:"auto", marginRight:".25rem",display:"flex"}} onClick={CreateKey}  icon={<Icon icon="plus"/>} color="green" circle/>
                {data?.Keys.map(renderKOb)}
            </PanelGroup>
        </div>
    </div>

)
}  

export default AdminPage