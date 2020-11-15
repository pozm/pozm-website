import React, {useEffect, useState} from 'react';
import '../styles/InfoBox.css';
import '../styles/utils.css';
import {parsePowerId, PowerTypes} from "../utils";
import {AdminData} from "../types/adminTypes";
import {useParams} from "react-router-dom";
import Page404 from "./404";
import UserFont from "../components/UserFont";
import {Loader} from "rsuite";
import UserFontID from "../components/UserFontID";
import UserBand from "../components/UserBand";

type Props = {};


export const UserPage: React.FC<Props> = () => {
    // const {user} = useUser()
    let {id} = useParams<{ id: string }>()
    let [fetchedUser,setFetchedUser] = useState<AdminData.User >()
    useEffect(() => {
        fetch('/api/user/'+id, {
            method: "GET"
        }).then(txt => {
            txt.json().then(jsn => {
                console.log(jsn.data)
                setFetchedUser(jsn.data ?? {})
            })
        })
    }, [id, setFetchedUser])
    if (!fetchedUser) return (<Loader size={"lg"} center  />)
    if (!id || !fetchedUser?.Username) return (<Page404/>)
    return (
        <div className="home">
            <UserBand user={fetchedUser} desc={<>
                <p style={{ fontSize:"medium" }} > Registered since {new Date(fetchedUser?.RegisteredAT).toLocaleDateString()} • {<UserFont userPower={parsePowerId(fetchedUser?.PowerID) as PowerTypes}>{parsePowerId(fetchedUser.PowerID)}</UserFont>}  </p>
                <p style={{ fontSize:"medium" }} > Invited by <UserFontID ID={fetchedUser?.InvitedBy}/></p>
            </>} />

        </div>
    );
}
export default UserPage;
