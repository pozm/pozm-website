import React, {useCallback, useEffect, useState} from "react";
import DiscordUser from "../components/discordUser";
import {Alert, Loader, Panel} from "rsuite"
import {useMediaQuery} from "react-responsive";
import useUser from "../hooks/useUser";
import UserFont from "../components/UserFont";
import {AdminData} from "../types/adminTypes";
import {Link} from "react-router-dom";

type Props = {};


export const Home: React.FC<Props> = () => {
    const {user} = useUser()
    const [coolUsers, setcoolUsers] = useState<AdminData.User[]>()
    useEffect(() => {
        fetch("/api/Users?a=2&r=true&p=gt-0").then(resp => {
            return resp.json()
        }).then(jsn => {
            if (jsn?.error) return Alert.error(<div> there was an issue with loading users</div>)
            else return setcoolUsers(jsn?.data.users ?? [])
        })
    }, [setcoolUsers])

    const renderCoolUsers = useCallback(() => {
        return coolUsers?.map(v => {
            return (
                <div className={"col"}>
                    <DiscordUser
                        userName={<Link to={"/user/" + v.ID}><UserFont user={v}> {v.Username} </UserFont></Link>}
                        avatar={v.AvatarUri}/>
                </div>
            )
        })
    }, [coolUsers])

    const isMobile = useMediaQuery({query: '(max-width: 760px)'});
    return (
        <div className={"home"}>
            <Panel style={{backgroundColor: "#ffffff11", padding: "15px 0px"}}
                   className="my-2">
                <h1 className="display-3">Hello{user?.ID && <>, <UserFont
                    user={user}>{user?.Username}</UserFont> </>}</h1>
                <p className="lead">Welcome to my website.</p>
                {/*<hr className="my-4"/>*/}

            </Panel>
            <div className="row justify-content-md-center">
                <div className={`col col-${isMobile ? 12 : 3}`}>

                    <h1 className={"font-weight-light"}>So like who are you?</h1>
                    <p>I'm a developer with knowledge of various languages, primarily focused in js/ts, c#, c++, and
                        python. I'm currently intrigued by golang.</p>
                </div>
                <div className="col col-lg-4">

                    <h1 className={"font-weight-light"}>Some cool people</h1>
                    <div className={`row justify-content-md-center row-cols-${isMobile ? 1 : 2}`}>
                        {coolUsers ? renderCoolUsers() : <Loader/>}
                    </div>
                </div>
            </div>



            <div style={{marginTop: "30px"}}>

                {/*wave*/}

                <div className="wave-38scNw" aria-hidden="true" style={{marginTop: "10px"}}>
                    <svg className="wave-1hkxOo" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100"
                         preserveAspectRatio="none">
                        <path
                            className="wavePath-haxJK1"
                            d="M826.337463,25.5396311 C670.970254,58.655965 603.696181,68.7870267 447.802481,35.1443383 C293.342778,1.81111414 137.33377,1.81111414 0,1.81111414 L0,150 L1920,150 L1920,1.81111414 C1739.53523,-16.6853983 1679.86404,73.1607868 1389.7826,37.4859505 C1099.70117,1.81111414 981.704672,-7.57670281 826.337463,25.5396311 Z"
                            fill="var(--secondary-darkColor)"
                        />
                    </svg>
                </div>

                <div className="row justify-content-md-center"
                     style={{marginLeft: 0, marginRight: 0, backgroundColor: "var(--secondary-darkColor)"}}>
                    <h1 className={"font-weight-light"} style={{width: "99%"}}>Bingus llc projects</h1>
                    <hr className={""}/>
                </div>
                <div className={`row justify-content-md-center row-cols-${isMobile ? 1 : 3}`}
                     style={{marginLeft: 0, marginRight: 0, backgroundColor: "var(--secondary-darkColor)"}}>
                    <div className={`col`}>

                        <h2 className={"font-weight-light"}>Discord token gen</h2>
                        <p>
                            This is a tool we will use to mass create tokens for discord and sell for groundbreaking low prices as a reputable source. <br/>
                            Our tool works extremely fast and is able to generate over 20 tokens per minute with a single thread.
                        </p>
                    </div>
                    <div className={`col col-4`}>

                        <h2 className={"font-weight-light"}>Bot tools</h2>
                        <p>
                            This is an open sourced project used for managing discord tokens.
                        </p>
                        <h3>Features</h3>
                        <ul style={{justifyContent:"initial"}} >
                            <li>Ability to load up bot or user accounts</li>
                            <li>Easy and modular to use</li>
                            <li>Ability to manipulate the accounts with lua</li>
                            <li>And more...</li>
                        </ul>
                        <h3> Why choose us? </h3>
                        <ul>
                            <li>Modern UI</li>
                            <li>Extremely fast</li>
                            <li>Scalable</li>
                            <li>Customizable</li>
                        </ul>
                    </div>
                </div>

                <div className={`row justify-content-md-center row-cols-${isMobile ? 1 : 3}`}
                     style={{marginLeft: 0, marginRight: 0, paddingBottom:10 , backgroundColor: "var(--secondary-darkColor)"}}>
                    <div className={`col `}>
                        <h3 className={"font-weight-light"} style={{width: "99%"}}>Created by </h3>
                        <hr className={""}/>
                        {/*<p>bingus llc, our members conclude of </p>*/}
                    </div>
                </div>

                <div className={`row justify-content-md-center row-cols-${isMobile ? 1 : 6}`} style={{marginLeft:0,marginRight:0,paddingBottom:10, backgroundColor:"var(--secondary-darkColor)"}} >
                    <div className={`col `}>
                        <DiscordUser userName={'Pozm'} style={{backgroundColor:"#292F37"}} avatar={'https://cdn.discordapp.com/avatars/288062966803333120/c9c4fc92c587a818f2794def05681daa.png?size=128'} />
                    </div>
                    <div className={`col `}>
                        <DiscordUser userName={'Bork'} reff={"http://borks.club"} style={{backgroundColor:"#292F37"}} avatar={'https://cdn.discordapp.com/avatars/784212696367104010/ba4e8461d490745cb73a622074e70ba1.png?size=128'} />
                    </div>
                </div>


                <div className={`row justify-content-md-center row-cols-${isMobile ? 1 : 3}`}
                     style={{marginLeft: 0, marginRight: 0, backgroundColor: "var(--secondary-darkColor)"}}>
                    <a href={"https://discord.gg/HfpwPCCt6h"}><h4> Our discord </h4></a>
                </div>

                {/*wave*/}

                <div className="wave-38scNw invertedWave-2Uzmgv" style={{transform: "matrix(1,0,0,-1,0,0)"}}
                     aria-hidden="true">
                    <svg className="wave-1hkxOo" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100"
                         preserveAspectRatio="none">
                        <path className="wavePath-haxJK1"
                              d="M826.337463,25.5396311 C670.970254,58.655965 603.696181,68.7870267 447.802481,35.1443383 C293.342778,1.81111414 137.33377,1.81111414 0,1.81111414 L0,150 L1920,150 L1920,1.81111414 C1739.53523,-16.6853983 1679.86404,73.1607868 1389.7826,37.4859505 C1099.70117,1.81111414 981.704672,-7.57670281 826.337463,25.5396311 Z"
                              fill="var(--secondary-darkColor)"/>
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default Home;