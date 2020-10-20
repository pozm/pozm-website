import React, { useContext } from "react";
import { Link } from "react-router-dom";
import DiscordUser from "../components/discordUser";
import userContext from "../hooks/userContext";
import az_pfp from "../images/discord/as.gif";
import at_pfp from "../images/discord/at.png";
import bo_pfp from "../images/discord/bo.gif";
import ds_pfp from "../images/discord/ds.webp";
import ha_pfp from "../images/discord/ha.gif";
import ka_pfp from "../images/discord/ka.png";
import pe_pfp from "../images/discord/pe.gif";
import bl_pfp from "../images/discord/bl.gif";
import bu_pfp from "../images/discord/bu.png";
import pi_pfp from "../images/discord/pi.webp";
type Props= {

};


export const Home: React.FC<Props> = () => {
  let data = useContext(userContext);
  return (
    <div className="home">
      <div className="jumbotron">
        <h1 className="display-4">Hello, world!</h1>
        <p className="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
        <hr className="my-4"/>
        <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
        <a className="btn btn-primary btn-lg" href="#" role="button">Learn more</a>
      </div>
    </div>
  );
}

export default Home;