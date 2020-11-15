import React from "react";
import DiscordUser from "../components/discordUser";
import {Icon} from "rsuite";

function Contact() {
  return (
    <div className="home">
      <div className="container">
          <h1 className="font-weight-light"> Discord</h1>
          <DiscordUser userName="Pozm" avatar="https://cdn.discordapp.com/avatars/518763902570594314/27434f0090d5e16543a665d0fda537f9.webp?size=64" tag="4351" reff='discord://discordapp.com/users/288062966803333120/'/>
          <h1 className="font-weight-light"> <Icon icon={"github"} size={"3x"}/> Github</h1>
          <DiscordUser userName="Pozm" avatar="https://avatars0.githubusercontent.com/u/44528100?s=460&u=47de77268836b005cca20bb7e2a4213905130b3b&v=4" reff='https://github.com/pozm'/>
          <h1 className="font-weight-light"> <Icon icon={"envelope"} size={"3x"}/> EMail</h1>
          <DiscordUser userName="pozm@pozm.pw"/>
      </div>
    </div>
  );
}

export default Contact;