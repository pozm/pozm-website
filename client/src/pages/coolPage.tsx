import React, {createRef, useCallback, useEffect, useState} from "react";
import MediaQuery, {useMediaQuery} from "react-responsive";
import {useHistory, useParams} from "react-router-dom";
import {
    Affix,
    Button,
    Icon,
    IconButton,
    InputNumber,
    Loader,
    Pagination,
    Panel,
    Radio,
    RadioGroup,
    Slider
} from "rsuite";
import "../styles/coolpage.css"

type Props = {};

// let data = 0

let refToMainDiv = createRef<HTMLDivElement>()

export const TheCollection: React.FC<Props> = (props) => {
    let {id} = useParams<{ id: string }>()
    if (!id) id = "0";
    let his = useHistory();
    let [data, setdata] = useState<{ [x: string]: string[] | number, types: string[], Files: string[], Fit: number }>()
    let [globData, setGlobData] = useState<{ [x: string]: any }>({
        radio: window.localStorage.getItem("type") ?? "Normal",
        ipr: window.localStorage.getItem("ipr") ?? 2,
        loaded: {},
        vi: ''
    })
    const isMobile = useMediaQuery({query: '(max-width: 760px)'});
    useEffect(() => {
        fetch('/api/theCol', {
            body: JSON.stringify({id, type: globData?.radio}),
            method: "POST"
        }).then(txt => {
            txt.json().then(jsn => {
                setdata(jsn)
                if (parseInt(id) > (jsn?.Fit as number))
                    his.push(((jsn?.Fit - 1).toString() ?? id))
            })
        })
    }, [id, globData.radio,his])
    let onload = useCallback((event: React.SyntheticEvent<HTMLImageElement | HTMLVideoElement, Event>) => {
        let id = parseInt(($(event.target).attr("id")?.slice(4) ?? "-1"))
        setGlobData({...globData, loaded: {...globData?.loaded, [id]: true}})
    }, [globData])

    let onHide = useCallback(() => setGlobData({...globData, IsHidden: !globData?.IsHidden}), [globData])
    let onSlider = useCallback((val) => {
        window.localStorage.setItem("ipr", val)
        setGlobData({...globData, ipr: val})
    }, [globData])
    let allLoaded = useCallback(() => Object.values(globData?.loaded).every(v => v === true) && (Object.values(globData?.loaded).length === data?.Files.length || data?.Files.length === 0), [data,globData?.loaded])
    let isLoaded = useCallback((k) => globData?.loaded[k] === true, [globData])
    let setViewing = useCallback((u) => setGlobData({...globData, vi: u}), [globData])
    let isVideo = useCallback((k: number) => ["mp4", "mov", "webm"].some(known => (data?.Files[k] ?? "").includes(known)), [data?.Files])
    let GotoId = useCallback((newId: number) => {
        setGlobData({...globData, loaded: {}})
        his.replace("/TheCollection/" + (newId))
    }, [setGlobData, globData, his])


    let getDataAsImages = useCallback(() => {
        let d = data?.Files?.map((v, k) => !isVideo(k)
            ? <div key={k} onClick={() => setViewing(v)} style={{minHeight: 200}} className={`col my-2`}>
                {<img hidden={!isLoaded(k)}
                      onLoad={onload} id={"key_" + k}
                      className="col-12 coolimg"
                      src={v}
                      alt={""}
                />}
                {(!isLoaded(k)) &&
                <Loader size="lg"/>}
            </div>
            :
            <video controls src={v} className={`col-${isMobile ? 12 : 6} my-2`} onLoadedData={onload} id={"key_" + k}/>)
        if (d?.length === 0) return "Looks like theres no files to display"
        return d
    }, [data, onload, isMobile,isLoaded,isVideo,setViewing])

    let getTypesAsRatio = useCallback(() => {
        return data?.types?.map((v, k) => <Radio value={v} key={k}> {v} </Radio>)
    }, [data?.types])
    // useMemo(()=>{console.log(loaded)},[loaded])
    return (
        <div className="home">

            {globData.vi !== "" && (
                <div>
                    <div style={{
                        position: "fixed",
                        zIndex: 48,
                        width: "100vw",
                        height: "100vh",
                        top: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.66)"
                    }} className={"coolimg"} onClick={() => setViewing("")}/>

                    <img src={globData.vi} alt={""} className={"BigCoolImg"}/>

                </div>
            )}

            <Panel shaded className="container my-2" bordered>
                <RadioGroup
                    inline
                    name="radioList"
                    value={globData.radio}
                    onChange={value => {
                        console.log("going to update")
                        window.localStorage.setItem("type", value)
                        setGlobData({...globData, loaded: {}, radio: value})
                    }}
                >
                    {getTypesAsRatio()}
                </RadioGroup>
                <div>{(data?.Fit as unknown as number ?? 0) * 20} images in db</div>
                <br/>
                <MediaQuery minDeviceWidth={1824}>
                    Images per row
                    <Slider
                        defaultValue={globData?.ipr ?? 2}
                        min={1}
                        step={1}
                        max={6}
                        graduated
                        progress
                        onChange={onSlider}
                        renderMark={mark => {
                            return mark;
                        }}
                        tooltip

                    />
                </MediaQuery>
                <div className={"clearfix my-2"}>
                    <IconButton onClick={() => GotoId(parseInt(id) + 1)} appearance={"subtle"} className={"float-right"}
                                icon={<Icon icon={"right"}/>}/>
                    <IconButton onClick={() => GotoId(parseInt(id) - 1)} disabled={parseInt(id) <= 0}
                                appearance={"subtle"} className={"float-right"} icon={<Icon icon={"left"}/>}/>
                </div>
                <Affix top={10} style={{zIndex: 22}}>
                    <Button onClick={onHide} style={{right: 20, position: "absolute"}}
                            appearance="primary"> {globData?.IsHidden ? "UnHide" : "Hide"} </Button>
                </Affix>
                {!allLoaded() && <Loader size="lg" vertical content="Not all files are loaded"/>}
                <div ref={refToMainDiv} style={{
                    display: 'flex',
                    flexWrap: "wrap",
                    justifyContent: 'center',
                    filter: `blur(${globData?.IsHidden ? "22px" : "0px"})`
                }}>
                    <div className={`row align-items-center my-5 row-cols-${isMobile ? 1 : globData.ipr ?? 2}`}>
                        {getDataAsImages()}
                    </div>
                </div>
                <Pagination
                    prev
                    next
                    boundaryLinks
                    activePage={(parseInt(id) + 1)}
                    pages={data?.Fit}
                    maxButtons={isMobile ? 5 : 10}
                    onSelect={
                        (k) => {
                            setGlobData({...globData, loaded: {}})
                            his.replace("/TheCollection/" + (k - 1))
                        }
                    }
                    ellipsis
                />
                <InputNumber min={0} buttonAppearance={"link"} prefix={"jump to "} max={(data?.Fit ?? 0) - 1} value={id}
                             onChange={(v) => GotoId(Number(v))}/>
            </Panel>
        </div>
    );
}

export default TheCollection