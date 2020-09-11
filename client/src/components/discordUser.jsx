import React from "react";
import "../styles/discordUser.css";
import "../styles/utils.css";

class DiscordUser extends React.Component {
  render() {
    return (
      <div className="DiscordUser">
        <div
          className="avatarParent"
          style={{ marginBottom: this.props.text ? "10px" : "0px", justifyContent:!this.props.avatar && !this.props.tag ? 'center' : 'initial' }}
        >
          { this.props.avatar && 
            <div className="CircleMask" style={{ marginRight: "10px" }}>
              <img
                src={this.props.avatar}
                width={this.props.size ?? "64"}
                alt="uhh this should of loaded"
                />
            </div>
          }
          <p className="AvatarText">
            <a target="_blank" rel="noopener noreferrer" href={this.props.reff}>
              {this.props.userName}
            </a>
            {this.props.tag &&
              <span style={{ fontSize: "xx-small" }}>
                #{this.props.tag}
              </span>
            }
          </p>
        </div>
        {this.props.text && (
          <div style={{ maxWidth: "1000px", display: "flex" }}>
            <div className="hbar" />
            <p className="pcoolbg">{this.props.text}</p>
          </div>
        )}
      </div>
    );
  }
}
export default DiscordUser;
