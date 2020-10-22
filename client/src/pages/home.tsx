import React, {useContext, useEffect} from "react";
import userContext from "../hooks/userContext";
import DiscordUser from "../components/discordUser";
import {Notification} from "rsuite"

import bork_pfp from "../images/discord/bo.gif"
import buki_pfp from "../images/discord/bu.png"
import perth_pfp from "../images/discord/pe.gif"
import blorain_pfp from "../images/discord/bl.gif"
import kanner_pfp from "../images/discord/ka.png"
import {useMediaQuery} from "react-responsive";

type Props = {};


export const Home: React.FC<Props> = () => {
    let data = useContext(userContext);
    const isMobile = useMediaQuery({query: '(max-width: 760px)'});
    return (
        <div className={"home"}>
            <div className="jumbotron my-2">
                <h1 className="display-3">Hello{data?.user?.ID && `, ${data.user.Username}`}</h1>
                <p className="lead">Welcome to my website.</p>
                <hr className="my-4"/>
                <p>This is not a template, fuck you.</p>
            </div>
            <div className="row justify-content-md-center">
                <div className={`col col-${isMobile?12:3}`}>

                    <h1 className={"font-weight-light"}>So like who are you?</h1>
                    <p>well uhh im a programmer focused in js,c#,c++,py, and more. Im currently a developer at <a
                        href={"https://discord.gg/psu"}>PSU</a></p>
                </div>
                <div className="col col-lg-4">

                    <h1 className={"font-weight-light"}>Some cool people</h1>
                    <div className={`row justify-content-md-center row-cols-${isMobile? 1 : 2}`}>
                        <div className={"col"}>
                            <DiscordUser userName={"Chris 🗺"} tag={"0411"} avatar={bork_pfp}/>
                        </div>
                        <div className={"col"}>
                            <DiscordUser userName={"Buki"} tag={"1080"} avatar={buki_pfp}/>
                        </div>
                        <div className={"col"}>
                            <DiscordUser userName={"Perth"} tag={"0001"} avatar={perth_pfp}/>
                        </div>
                        <div className={"col"}>
                            <DiscordUser userName={"🎃💀BloRain💀🎃"} tag={"5793"} avatar={blorain_pfp}/>
                        </div>
                        <div className={"col"}>
                            <DiscordUser userName={"kanner"} tag={"9716"} avatar={kanner_pfp}/>
                        </div>

                    </div>
                    <p>If you have a invite to this website, consider yourself on this list.</p>
                </div>
            </div>
            <div className={"seper"} />
        </div>
    );
}

export default Home;