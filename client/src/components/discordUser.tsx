import React from "react";
import "../styles/discordUser.css";
import "../styles/utils.css";

type Props= {
  size? :string | number | undefined
  avatar? : string
  text? : string
  tag?: string
  reff? : string
  userName :string | JSX.Element
  className? : string
  style? : React.CSSProperties
  fontSize? : number

};

export const DiscordUser: React.FC<Props> = ({size=64,text,avatar,reff,tag,userName,className,style,fontSize}) => {
  return (

    <div className={"DiscordUserParent"} >

      {/* avatar */}
      <img className={"Avatar"} width={size} src={avatar} />

      {/* text */}

      <div className={"Text"} style={{fontSize: fontSize? fontSize : "initial" }} >

        { reff ? <a href={reff} > {userName} </a> : userName }

      </div>

    </div>
  );
}
export default DiscordUser;
