import React, { useCallback, useContext, useEffect, useState } from "react";
import {Alert, Icon, IconButton, Panel, PanelGroup} from "rsuite";
import { AdminData } from "../types/adminTypes";
import userContext from "../hooks/userContext";
type Props= {

};


const AdminPage: React.FC<Props> = () => {

    let [data,setData] = useState<AdminData.RootObject|null>( null )
    let UserContext = useContext(userContext)
    useEffect(()=>{
        fetch('/api/adminData').then(txt=>{
            txt.json().then(jsn=>{
              setData(jsn)
            })
        })
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
                let newUsers = data.users.filter(value => value.ID != target )
                setData({users:newUsers})
            }
            else {
                Alert.error(jsn.message)
            }
        }),()=>Alert.error("Unable to fetch"))
    },[data,setData])

    let renderOb = useCallback((val:AdminData.User)=>{

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

return (

    <div className="home">
        <div className="container my-2">
            <PanelGroup accordion bordered>
                {data?.users.map(renderOb)}
            </PanelGroup>
        </div>
    </div>

)
}  

export default AdminPage