import React, {useCallback, useEffect, useState} from "react";
import DiscordUser from "../components/discordUser";
import {Alert, Loader, Panel} from "rsuite"
import {useMediaQuery} from "react-responsive";
import useUser from "../hooks/useUser";
import UserFont from "../components/UserFont";
import {AdminData} from "../types/adminTypes";
import {genRand} from "../utils";
import {Link} from "react-router-dom";

type Props = {};


export const Home: React.FC<Props> = () => {
    const {user} = useUser()
    const [coolUsers,setcoolUsers] = useState<AdminData.User[]>()
    useEffect(()=>{
        fetch("/api/users").then(resp=>{
            return resp.json()
        }).then(jsn=>{
            if (jsn?.error) return Alert.error(<div> there was an issue with loading users</div>)
            else return setcoolUsers(jsn?.data ?? [])
        })
    },[setcoolUsers])

    const renderCoolUsers = useCallback(() => {
        let n = genRand(0,coolUsers!.length-1)
        let n2 = n === coolUsers!.length-1 ? genRand(0,n-1) : genRand(n+1,coolUsers!.length-1)
        return coolUsers?.filter((val, idx ) => idx === n2 || idx === n).map(v=>{
            return (
                <div className={"col"}>
                    <DiscordUser userName={<Link to={"/user/"+v.ID} ><UserFont user={v}> {v.Username} </UserFont></Link>}  avatar={v.AvatarUri}/>
                </div>
            )
        })
    },[coolUsers])

    const isMobile = useMediaQuery({query: '(max-width: 760px)'});
    return (
        <div className={"home"}>
            <Panel bordered={true} shaded bodyFill style={{backgroundColor: "#ffffff11", padding: "15px 0px"}}
                   className="my-2">
                <h1 className="display-3">Hello{user?.ID && <>, <UserFont user={user}>{user?.Username}</UserFont> </> }</h1>
                <p className="lead">Welcome to my website.</p>
                <hr className="my-4"/>

            </Panel>
            <div className="row justify-content-md-center">
                <div className={`col col-${isMobile ? 12 : 3}`}>

                    <h1 className={"font-weight-light"}>So like who are you?</h1>
                    <p>well uhh im a programmer focused in js,c#,c++,py, and more. Im currently a developer at <a
                        href={"https://discord.gg/psu"}>PSU</a></p>
                </div>
                <div className="col col-lg-4">

                    <h1 className={"font-weight-light"}>Some cool people</h1>
                    <div className={`row justify-content-md-center row-cols-${isMobile ? 1 : 2}`}>
                        { coolUsers ? renderCoolUsers() : <Loader/> }

                    </div>
                </div>
            </div>
            {/*<div className={"seper"}/>*/}
                <div className="wave-38scNw" aria-hidden="true" style={{marginTop:"10px"}} >
                    <svg className="wave-1hkxOo" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100"
                         preserveAspectRatio="none">
                        <path
                            className="wavePath-haxJK1"
                            d="M826.337463,25.5396311 C670.970254,58.655965 603.696181,68.7870267 447.802481,35.1443383 C293.342778,1.81111414 137.33377,1.81111414 0,1.81111414 L0,150 L1920,150 L1920,1.81111414 C1739.53523,-16.6853983 1679.86404,73.1607868 1389.7826,37.4859505 C1099.70117,1.81111414 981.704672,-7.57670281 826.337463,25.5396311 Z"
                            fill="var(--secondary-darkColor)"
                        />
                    </svg>
                </div>

            <div className="row justify-content-md-center" style={{backgroundColor:"var(--secondary-darkColor)"}} >
                <h1 className={"font-weight-light"} style={{width:"99%"}} >Projects im working on </h1>
                <hr className={""} />
            </div>
            <div className={`row justify-content-md-center row-cols-${isMobile ? 1 : 2}`} style={{backgroundColor:"var(--secondary-darkColor)"}} >
                <div className={`col col-${isMobile ? 12 : 3}`}>

                    <h2 className={"font-weight-light"}>Discord token gen</h2>
                    <p> Discord token gen is a private tool which allows us to generate email verified discord user tokens. We plan to use it to sell tokens in bulk <a
                        href={"https://discord.gg/HfpwPCCt6h"}>Our Discord</a></p>
                </div>
                <div className={`col col-${isMobile ? 12 : 3}`}>

                    <h2 className={"font-weight-light"}>Bot tools</h2>
                    <p>Bot tools is a tool used to manage mass discord tokens (bot or user). with alot of functionality & accessibility to run lua, from inside the tool you are able to see servers, and tokens you have stored.<a
                        href={"https://discord.gg/HfpwPCCt6h"}>Our Discord</a></p>
                </div>
                <div className={`col col-${isMobile ? 12 : 3}`}>

                    <h2 className={"font-weight-light"}>PSU whitelist</h2>
                    <p>This project is a whitelist which can be bought and integrated with your scripts very easily, without having to setup a database or a backend to handle users. <a
                        href={"https://discord.gg/psu"}>PSU discord</a></p>
                </div>

            </div>

                <div className="wave-38scNw invertedWave-2Uzmgv" style={{transform:"matrix(1,0,0,-1,0,0)"}} aria-hidden="true">
                    <svg className="wave-1hkxOo" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100"
                         preserveAspectRatio="none">
                        <path className="wavePath-haxJK1"
                              d="M826.337463,25.5396311 C670.970254,58.655965 603.696181,68.7870267 447.802481,35.1443383 C293.342778,1.81111414 137.33377,1.81111414 0,1.81111414 L0,150 L1920,150 L1920,1.81111414 C1739.53523,-16.6853983 1679.86404,73.1607868 1389.7826,37.4859505 C1099.70117,1.81111414 981.704672,-7.57670281 826.337463,25.5396311 Z"
                              fill="var(--secondary-darkColor)"/>
                    </svg>
                </div>
        </div>
    );
}

export default Home;