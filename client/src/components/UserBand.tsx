import React from "react";
// import data from "../JSON-Data/h.json"
import {parsePowerId, PowerTypes} from "../utils"
import UserFont from "./UserFont";
import {AdminData} from "../types/adminTypes";
import {useMediaQuery} from "react-responsive";

type Props = {
    user: AdminData.User
    desc: JSX.Element
};


const UserBand: React.FC<Props> = (props) => {
    const isMobile = useMediaQuery({query: '(max-width: 760px)'});
    return (
        <div style={{width:"100%", marginBottom:50, height:!isMobile ? 200 : "auto", background: "#ffffff11", flexFlow: !isMobile ? "wrap" : "column-reverse" , display:"flex", borderRadius: "0px 0px 6px 6px" }} className={" p-4 px-5"} >
            <div className="AvatarText" style={{fontSize:"xxx-large",alignSelf:"center"}} >
                <UserFont userPower={parsePowerId(props.user?.PowerID) as PowerTypes}>{props.user?.Username ?? ""}</UserFont>
                {props.desc}
            </div>
            <div
                className="avatarParent"
                style={{marginLeft: !isMobile ? "auto" : "initial", justifyContent: !isMobile ?  "initial" : "center" }}
            >
                <div className="CircleMask" style={{ marginRight: "10px" }}>
                    <img
                        src={props.user?.AvatarUri}
                        width={128}
                        alt=""
                    />
                </div>
            </div>
        </div>
    )
}

export default UserBand