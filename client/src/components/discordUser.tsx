import React from "react";
import "../styles/discordUser.css";
import "../styles/utils.css";

type Props= {
  size? :string | number | undefined
  avatar? : string
  text? : string
  tag?: string
  reff? : string
  userName :string
  className? : string
  style? : React.CSSProperties

};

export const DiscordUser: React.FC<Props> = ({size,text,avatar,reff,tag,userName,className,style}) => {
  return (
    <div style={style} className={`DiscordUser ${className ??""}`}>
      <div
        className="avatarParent"
        style={{ marginBottom: text ? "10px" : "0px", justifyContent:!avatar && !tag ? 'center' : 'initial' }}
      >
        { avatar && 
          <div className="CircleMask" style={{ marginRight: "10px" }}>
            <img
              src={avatar}
              width={size ?? "64"}
              alt="uhh should of loaded"
              />
          </div>
        }
        <p className="AvatarText">
          <a target="_blank" rel="noopener noreferrer" href={reff}>
            {userName}
          </a>
          {tag &&
            <span style={{ fontSize: "xx-small" }}>
              #{tag}
            </span>
          }
        </p>
      </div>
      {text && (
        <div style={{ maxWidth: "1000px", display: "flex" }}>
          <div className="hbar" />
          <p className="pcoolbg">{text}</p>
        </div>
      )}
    </div>
  );
}
export default DiscordUser;
