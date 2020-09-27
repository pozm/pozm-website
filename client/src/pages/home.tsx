import React, { useContext } from "react";
import { Link } from "react-router-dom";
import DiscordUser from "../components/discordUser";
import bo_pfp from "../images/discord/bo.gif"
import bl_pfp from "../images/discord/bl.png"
import ds_pfp from "../images/discord/ds.webp"
import az_pfp from "../images/discord/as.gif"
import ha_pfp from "../images/discord/ha.gif"
import pi_pfp from "../images/discord/pi.webp"
import userContext from "../hooks/userContext";
import { Carousel } from "rsuite";
type Props= {

};


export const Home: React.FC<Props> = () => {
  let data = useContext(userContext);
  return (
    <div className="home">
      <div className="container">
        <div className="row align-items-center my-5">
          <div className="col-lg-7">
            <Carousel autoplay className="custom-slider">
              <img src="https://i.imgur.com/iiwrpw6.png" height="280px" style={{objectFit:'cover'}} className="d-block  rounded" alt="http://placehold.it/900x400"/>
              <img src="https://i.imgur.com/6mnqNMX.png" height="280px" style={{objectFit:'cover'}} className="d-block  rounded" alt="http://placehold.it/900x400"/>
              <img src="https://i.imgur.com/WcSUO02.png"  height="280px" style={{objectFit:'cover'}} className="d-block rounded" alt="http://placehold.it/900x400"/>
            </Carousel>
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
              Some programming languages i know conclude of python, javascript, typescript, c#, lua, mysql <span style={{fontSize:'0px'}} >(i know it's a query lanuage more than a programming language)</span> .
              Some markup languages i know: html, markdown, css
            </p>
          </div>
        </div>
        <div className="row align-items-center my-5" style={{justifyContent:"center",flexFlow:"column"}}>
          <div className="col-lg-5">
            <h1 className="font-weight-light">Some cool people</h1>
            <DiscordUser avatar = {bo_pfp} userName='Bork' reff="https://discord.gg/GGeB7Q4" />
            <DiscordUser avatar = {bl_pfp} userName='Yow' reff="https://twitter.com/bluedogz162" />
            <DiscordUser avatar = {ds_pfp} userName='Dsf' reff="https://twitter.com/dsfwastaken" />
            <DiscordUser avatar = {az_pfp} userName='Astroz' reff="https://twitter.com/AstrozTm" />
            <DiscordUser avatar = {ha_pfp} userName='Harmer' tag="1111" />
            <DiscordUser avatar = {pi_pfp} userName='pickl' tag="6609" />
          </div>
        </div>
        <small> {data?.user?.ID ? <Link to="Other" >View other content</Link> : 'Sign in to access more!'} </small>
      </div>
      <div className="seper" />
      <div className="container" >
        <div className="row align-items-center my-5" style={{justifyContent:"center",flexFlow:"column"}} >
          <div className="col-lg-7">
            <h1 className="font-weight-light"> Projects which i (have / currently) working on </h1>
              <div style={{padding:'0px 50px'}} >
                <ul style={{textAlign: "start"}}>
                  <li> <a href="https://github.com/pozm/Abyss">Discord bot</a> </li>
                  <li> <a href="https://github.com/pozm/pozm-website">This website</a> </li>
                  <li> <a href="https://github.com/Bork0038/bot-tools">Bot tools for discord</a> </li>
                  <li> Private things </li>
                </ul>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;