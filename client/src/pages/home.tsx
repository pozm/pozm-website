import React, { useContext } from "react";
import { Link } from "react-router-dom";
import DiscordUser from "../components/discordUser";
import bo_pfp from "../images/discord/bo.gif"
import bl_pfp from "../images/discord/bl.png"
import ds_pfp from "../images/discord/ds.webp"
import az_pfp from "../images/discord/as.gif"
import ha_pfp from "../images/discord/ha.gif"
import sh_pfp from "../images/discord/sh.png"
import st_pfp from "../images/discord/st.png"
import at_pfp from "../images/discord/at.png"
import pi_pfp from "../images/discord/pi.webp"
import fa_pfp from "../images/discord/fa.png"
import userContext from "../hooks/userContext";
type Props= {

};


export const Home: React.FC<Props> = () => {
  let data = useContext(userContext);
  return (
    <div className="home">
      <div className="container">
        <div className="row align-items-center my-5">
          <div className="col-lg-6">
            <h1 className="font-weight-light">Welcome</h1>
            <p>
              Hi, welcome to my website.
              For information about the website you can view your it from your right.
            </p>
            <h4>Contacting </h4>
            You can contact me from <a href="/contact"  >/contact or by clicking here</a>
          </div>
          <div className="col-lg-6">
            <h1 className="font-weight-light">Info about this website</h1>
            <p>
              This website is used for tools / other shit i want to show without having to make a winform for (as the ui design tools are shit).
              I have a signup / login system which is pretty much obsolete and is only used for me / a few friends where i have more specialised tools accessible.
            </p>
            <h3> sooo why? </h3>
            Eh, i was bored and i decided that i wanted a website, so i made one. The original website which i made was horrible and completely bad. This website is a remake in react.
            Another reason for me making this is so that i could learn css + html. I also wanted to learn how javascript on the client worked, which i achieved knowledge of.
          </div>
        </div>
        <div className="row align-items-center my-5" style={{justifyContent:"center",flexFlow:"column"}}>
          <div className="col-lg-7">
            <h1 className="font-weight-light">Who am I?</h1>
            <p>
              I am a programmer interested in software / game development & game "hacking".
              I started off exploiting games in Lua, although now i currently dislike making cheats in Lua this is because how you don't have full access to memory etc.
              I'm currently only using c# and c++ for making cheats. with me mostly using c++, and rarely using c# (only for external sometimes).
              I have alot of knowledge in javascript, python, lua, and c#. I know various other languages including c++.
              Currently im looking to purchase a rtx 3080, but it constantly goes offsale in seconds. I have made a client to get info as to if it's on sale etc which can be located <a href="https://github.com/pozm/Nvidia_Rtx_Client">here</a>.
            </p>
          </div>
        </div>
        <div className="row align-items-center my-5" style={{justifyContent:"center",flexFlow:"column"}}>
          <div className="col-lg-5">
            <h1 className="font-weight-light">Some cool people</h1>
          </div>
          <div className="row row-cols-2 my-5" style={{justifyContent:"center", maxWidth:"100vw"}} >
            <DiscordUser style={{ transformOrigin: "right bottom" }}  className="col-4 mx-1" avatar = {bo_pfp} userName='Bork' reff="https://discord.gg/SvTxqsR" />
            <DiscordUser style={{ transformOrigin: "left bottom" }}   className="col-4 mx-1" avatar = {bl_pfp} userName='Yow' reff="https://twitter.com/bluedogz162" />
            <DiscordUser style={{ transformOrigin: "right center" }}  className="col-4 mx-1" avatar = {ds_pfp} userName='Dsf' reff="https://twitter.com/dsfwastaken" />
            <DiscordUser style={{ transformOrigin: "left center" }}   className="col-4 mx-1" avatar = {az_pfp} userName='Astroz' reff="https://twitter.com/AstrozTm" />
            <DiscordUser style={{ transformOrigin: "right center" }}  className="col-4 mx-1" avatar = {ha_pfp} userName='Harmer' tag="1111" />
            <DiscordUser style={{ transformOrigin: "left center" }}   className="col-4 mx-1" avatar = {pi_pfp} userName='pickl' tag="6609" />
            <DiscordUser style={{ transformOrigin: "right center" }}  className="col-4 mx-1" avatar = {sh_pfp} userName='Shawn' tag="2000" />
            <DiscordUser style={{ transformOrigin: "left center" }}   className="col-4 mx-1" avatar = {at_pfp} userName='autist69420' tag="2047" />
            <DiscordUser style={{ transformOrigin: "right top" }}    className="col-4 mx-1" avatar = {st_pfp} userName='Stan' tag="9415" />
            <DiscordUser style={{ transformOrigin: "left top" }}    className="col-4 mx-1" avatar = {fa_pfp} userName='fate' tag="3314" />
          </div>
        </div>
      </div>
      <div className="seper" />
      <div className="container" >
        <div className="row align-items-center my-5" style={{justifyContent:"center",flexFlow:"column"}} >
          <div className="col-lg-7">


            <small> legal stuff can be found @ <Link to="/legal" > /legal </Link></small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;