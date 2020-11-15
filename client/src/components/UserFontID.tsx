import React, {useEffect, useState} from "react";
// import data from "../JSON-Data/h.json"
import {parsePowerId} from "../utils"
import {AdminData} from "../types/adminTypes";
import {Link} from "react-router-dom";

type Props = {
    ID :string
};


export const UserFontID: React.FC<Props> = (props) => {
    let [user,setUser] = useState<AdminData.User>()
    useEffect(()=>{
        fetch("/api/user/"+props.ID).then(resp=>resp.json()).then(jsn=>{
            if (jsn?.error) setUser(({Username : 'Unknown', PowerId:0, ID: props.ID} as any))
            else setUser(jsn.data)
        })
    },[setUser])
    return <Link to={'/user/'+props.ID} ><span id={parsePowerId(user?.PowerID ?? 0) as string}>{user?.Username}</span></Link>
}

export default UserFontID