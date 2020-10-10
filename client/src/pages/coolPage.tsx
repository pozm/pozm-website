import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { Loader, Pagination, Panel, Radio, RadioGroup } from "rsuite";
type Props= {
};

let data = 0

export const TheCollection: React.FC<Props> = (props) => {
  let {id} = useParams<{id:string}>()
  let his = useHistory();
  let [data,setdata] = useState<{[x:string]:string[]|number, types:string[] , Files : string[] , Fit:number}>()
  let [loaded,setLoaded] = useState<{[x:number]:boolean}>({})
  let [ratio,setRatio] = useState<string>( window.localStorage.getItem("type") ??"Normal")
  const isMobile = useMediaQuery({ query: '(max-width: 760px)' });
  if (!id) his.replace("/TheCollection/"+0)
  useEffect(()=>{
    fetch('/api/theCol', {
      body: JSON.stringify({id,type:ratio}),
      method:"POST"
    }).then(txt=>{
      txt.json().then(jsn=>{
        let rdata = jsn
        setdata(jsn)
        console.log(parseInt(id), jsn?.Fit)
        if (parseInt(id) > (jsn?.Fit as number))
          his.push(((jsn?.Fit-1).toString() ?? id))
      })
    })
  },[id,ratio])
  let onload = useCallback((event: React.SyntheticEvent<HTMLImageElement|HTMLVideoElement, Event>)=>{
    let id = parseInt(($(event.target).attr("id")?.slice(4) ?? "-1"))
    setLoaded( {...loaded, [id]:true} )
  },[loaded])

  let allLoaded = useCallback(()=>Object.values(loaded).every(v=>v===true) && Object.values(loaded).length == data?.Files.length || data?.Files.length == 0 ,[loaded,data])
  let isLoaded = useCallback((k)=>loaded[k] === true,[loaded])
  let isVideo = useCallback((k:number)=>["mp4","mov","webm"].includes(((data?.Files[k]??"").slice(-4) ?? "")) ,[loaded])


  let getDataAsImages = useCallback(()=>{
    let d = data?.Files?.map((v,k)=> !isVideo(k) ? <a key={k} className={`col-${isMobile ? 12 : 6} my-2`} href={v} > {<img hidden={!isLoaded(k)} onLoad={onload} id={"key_"+k} className="col-12" src={v} /> } {(!isLoaded(k)) && <Loader size="lg" />} </a> : <video controls src={v} className={`col-${isMobile ? 12 : 6} my-2`}  onLoad={onload} id={"key_"+k} /> )
    if (d?.length == 0) return "Looks like theres no files to display"
    return d
  },[data,onload,allLoaded,isMobile])
  
  let getTypesAsRatio = useCallback(()=>{
    return data?.types?.map((v,k)=> <Radio value={v} key={k} > {v} </Radio>)
  },[data,onload,allLoaded])
  // useMemo(()=>{console.log(loaded)},[loaded])


  return (
    <div className="home">
      <Panel className="container my-2" bordered >
        <RadioGroup
          inline
          name="radioList"
          value={ratio}
          onChange={value => {
            console.log("going to update")
            window.localStorage.setItem("type",value)
            setLoaded({})
            setRatio(value)
          }}
        >
          {getTypesAsRatio()}
        </RadioGroup>
        <div>{ (data?.Fit as unknown as number ?? 0) *20 } images in db </div>
        { !allLoaded() && <Loader size="lg" vertical content="Not all files are loaded" />}
        <div style={{display:'flex',flexWrap:"wrap",justifyContent:'center'}}>
          <div className="row align-items-center my-5 row-cols-2">
            {getDataAsImages()}
          </div>
        </div>
        <Pagination
        prev
        next
        boundaryLinks
        activePage={(parseInt(id)+1)}
        pages={data?.Fit}
        maxButtons={ isMobile ? 5 : 10}
        onSelect={
          (k)=>{
            setLoaded({})
            his.replace("/TheCollection/"+(k-1))
          }
        }
        ellipsis
        />
      </Panel>
    </div>
  );
}

export default TheCollection