import React, {CSSProperties, useCallback, useState} from "react";
import "../styles/utils.css";
import "../styles/Box.css";
import {Link} from "react-router-dom";
import {Animation} from "rsuite"

type Props= {

    style? : CSSProperties
    width? : number | string
    height? : number | string
    url: string
    link?: string

};

const ImageDesc = React.forwardRef(({ ...props }, ref: React.Ref<any>) => (
    <div {...props} ref={ref} style={{ width:"calc(100% - 2px)", height:"23%", borderRadius:"8px", position:"absolute" , backdropFilter:"saturate(180%)  blur(30px)", left:1,color:"white", mixBlendMode:"difference" ,bottom:1 }} >

        {props.children}

    </div>
));


export const BoxImage: React.FC<Props> = (props) => {

    let [hoverState,setHoverState] = useState(false);

    const onHover = useCallback((s)=>{

            setHoverState(s)

    },[setHoverState])

    let content = (
            <Animation.Fade in={hoverState} >{ (propsa, ref) =>

                <ImageDesc ref={ref} {...propsa} >{props.children}</ImageDesc>

                }
            </Animation.Fade>
    )
    let styleProps : CSSProperties = {...props.style, width:props.width,height:props.height, background:`url(${props.url})`, position:"relative",backgroundSize:"cover" }
    return (
        props.link ?
            <Link to={props.link} className={"Box Image"} style={ styleProps }  onMouseEnter={()=>onHover(true)} onMouseLeave={()=>onHover(false) } >
                {content}
            </Link> :
            <div className={"Box Image"} style={ styleProps }  onMouseEnter={()=>onHover(true)} onMouseLeave={()=>onHover(false) } >
                {content}
            </div>
    );
}
export default BoxImage;
