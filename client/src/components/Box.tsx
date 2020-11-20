import React, {CSSProperties} from "react";
import "../styles/utils.css";
import "../styles/Box.css";

type Props= {

    style? : CSSProperties
    width? : number | string
    height? : number | string

};

export const Box: React.FC<Props> = (props) => {
    return (

        <div className={"Box"} style={ {...props.style, width:props.width,height:props.height} }  >

            {props.children}

        </div>
    );
}
export default Box;
