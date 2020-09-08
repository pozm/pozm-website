import React from "react";
import { Link } from "react-router-dom";
import DiscordUser from "../components/discordUser";
import bo_pfp from "../images/discord/bo.gif"
import bl_pfp from "../images/discord/bl.png"
import ds_pfp from "../images/discord/ds.webp"
import az_pfp from "../images/discord/az.gif"
import ha_pfp from "../images/discord/ha.gif"
import pi_pfp from "../images/discord/pi.webp"
function Home() {
  return (
    <div className="home">
      <div className="container">
        <div className="row align-items-center my-5">
          <div className="col-lg-7">
            <div id="carousel" className="carousel slide" data-ride="carousel">
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img src="https://i.imgur.com/iiwrpw6.png" height="280px" style={{objectFit:'cover'}} className="d-block w-100  rounded" alt="http://placehold.it/900x400"/>
                </div>
                <div className="carousel-item">
                  <img src="https://i.imgur.com/6mnqNMX.png" height="280px" style={{objectFit:'cover'}} className="d-block w-100  rounded" alt="http://placehold.it/900x400"/>
                </div>
                <div className="carousel-item">
                  <img src="https://i.imgur.com/WcSUO02.png"  height="280px" style={{objectFit:'cover'}} className="d-block w-100 rounded" alt="http://placehold.it/900x400"/>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <h1 className="font-weight-light">Home</h1>
            <p>
              Hi, welcome to my website.
              it's primarily used as a interface for my backend for example modifying settings / viewing your activity of one of my services.
              If for some reason you want to contact me, well you can from <Link to="/contact">here</Link>
            </p>
          </div>
        </div>
        <div className="row align-items-center my-5" style={{justifyContent:"center",flexFlow:"column"}}>
          <div className="col-lg-7">
            <h1 className="font-weight-light">Who am I?</h1>
            <p>
              I am a programmer.
              I know various different programming langages including most markup langages.
              Some programming languages i know conclude of python, javascript, typescript, c#, lua, mysql.
              Some markup languages i know: html, markdown, css
            </p>
          </div>
        </div>
        <div className="row align-items-center my-5" style={{justifyContent:"center",flexFlow:"column"}}>
          <div className="col-lg-5">
            <h1 className="font-weight-light">Some cool people</h1>
            <DiscordUser avatar = {bo_pfp} userName='Bork' />
            <DiscordUser avatar = {bl_pfp} userName='Yow' />
            <DiscordUser avatar = {ds_pfp} userName='Dsf' />
            <DiscordUser avatar = {az_pfp} userName='Astroz' />
            <DiscordUser avatar = {ha_pfp} userName='Harmer' />
            <DiscordUser avatar = {pi_pfp} userName='pickl' />
          </div>
        </div>
        <small>Sign in to access more!</small>
      </div>
    </div>
  );
}

export default Home;