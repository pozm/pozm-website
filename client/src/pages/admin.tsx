import React, { useCallback, useContext, useEffect, useState } from "react";
import { Panel } from "rsuite";
import { AdminData } from "../types/adminTypes";
type Props= {

};


const AdminPage: React.FC<Props> = () => {

    let [data,setData] = useState<AdminData.RootObject|null>( null )
    useEffect(()=>{
        fetch('/api/adminData').then(txt=>{
            txt.json().then(jsn=>{
              setData(jsn)
            })
        })
    })

    let renderOb = useCallback((val:AdminData.User)=>{
        
        let out = val.Username



        return (<Panel bordered className="row align-items-center my-5" style={{justifyContent:"center",flexFlow:"column"}}> {out} </Panel>)
    },[])

return (

    <div className="home">
        <div className="container my-2">
            {data?.users.map(renderOb)}
        </div>
    </div>

)
}  

export default AdminPage