import React from "react";
// import data from "../JSON-Data/h.json"
import {parsePowerId, PowerTypes} from "../utils"
import {AdminData} from "../types/adminTypes";

type Props = {
    userPower?: PowerTypes
    user?: AdminData.User
};


export const UserFont: React.FC<Props> = (props) => {
    if (props.userPower)
        return <span id={props.userPower as string}>{props.children}</span>

    else if (props.user)
        return <span id={parsePowerId(props.user.PowerID) as string}>{props.children}</span>

    return <span id={"user"}>{props.children}</span>
}

export default UserFont