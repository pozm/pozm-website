import $ from "jquery";
import React from "react";
import { Notification } from "rsuite";
import userContext from "../hooks/userContext";

let regx = /^https:\/\/(canary|ptb)?\.?discord(app)?\.com\/api\/webhooks\/(?<id>\d+)\/(?<secret>\S*)$/mi

let informationRef = React.createRef()

function getDataUrl(img) {
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // Set width and height
    canvas.width = img.width;
    canvas.height = img.height;
    // Draw the image
    ctx.drawImage(img, 0, 0);
    let data = canvas.toDataURL();
    canvas.remove()
    return data
}

class WebhookT extends React.Component {
    static contextType = userContext
    constructor(props){
        super(props)
        this.state = {URL : '', isUrlValid:false, webhookData:{}, modificationData:{content:'',avatar:'', avatarBASE:'',name:''}}

        this.OnURLUpdate = this.OnURLUpdate.bind(this);
        this.updateModificationData = this.updateModificationData.bind(this);
        this.onModify = this.onModify.bind(this);
        this.onSend = this.onSend.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }
    async OnURLUpdate(elem) {
        let val = elem.target.value
        let match = val.match(regx)
        if (! match) return (window.$(informationRef.current).collapse('hide'),this.setState({URL:'',isUrlValid:false,webhookData:{}}));
        $.ajax({
            url:`https://discord.com/api/webhooks/${match?.groups?.id}/${match?.groups?.secret}`,
            method:'GET',
            cache:false,
            crossDomain:true,
            success: (valu,status,res)=> {
                this.setState({URL:val,isUrlValid:true, webhookData: valu}, () => window.$(informationRef.current).collapse('show') )
                // $('#hlp').addClass("d-none")
            },
            error: () => {
                this.setState({URL:'val',isUrlValid:false, webhookData:{}}, () => window.$(informationRef.current).collapse('hide') )
                Notification.error({
                    title:"Invalid webhook",
                    description:`The webhook you provided is invalid.`
                })
                // $('#hlp').removeClass("d-none").text("You have provided an invalid URL.")
                // setTimeout(()=>$('#hlp').addClass("d-none"),3e3)
            }
        })
    }
    createInformation() {
        let data = this.state.webhookData
        let conv = Object.entries(data).map( ([key,value])=> ! ['application_id','type','avatar','token'].includes(key) && <label key={key.toString()} > {key}: {value}</label>)
        let half = conv.splice(0,Math.floor(conv.length/2))
        let both = [conv,half].map(v=><div className="col-lg-3 float-left" style={{display:'flex',flexFlow:'column'}} key={[conv,half].indexOf(v).toString()} >{v}</div>)
        return both
    }
    updateModificationData(elm) {
        let newdata = {[elm.target.id]:elm.target.value}
        if (elm.target.id === 'avatar') {
            newdata = {...newdata, avatarBASE: getDataUrl(document.createElement('img', {src:elm.target.value}))}
        }
        this.setState({modificationData:{...this.state.modificationData, ...newdata}})
    }
    async onModify() {
        let data = this.state.modificationData
        $.ajax({
            url:this.state.URL,
            data:{...data,avatar:null},
            cache:false,
            method:'PATCH',
            crossDomain:true,
            success:(val)=>{
                this.setState({webhookData:val})
                Notification.success({
                    title:"Modified webhook",
                    description:`Successfully modified the webhook with new data as ${ { name : [data.name] }.toString() }`
                })
            }
        })
        
    }
    onSend() {
        let data = this.state.modificationData
        $.ajax({
            url:this.state.URL,
            crossDomain:true,
            cache:false,
            data:{
                content:data.content,
                username:data.name,
                avatar_url:data.avatar
            },
            method:'POST',
            success:(val)=>{
                console.log('successfully sent')
                Notification.success({
                    title:"Sent data to webhook",
                    description:`Successfully sent data to the webhook.`
                })
            }
        })
        
    }
    onDelete() {
        $.ajax({
            url:this.state.URL,
            crossDomain:true,
            cache:false,
            method:'DELETE',
            success:(val)=>{
                console.log('successfully deleted')
                window.$(informationRef.current).collapse('hide')
                this.setState({URL:'',isUrlValid:false,webhookData:{}})
                Notification.success({
                    title:"Deleted webhook",
                    description:`Successfully deleted the webhook.`
                })
            }
        })
    }

    render() {
        return (
            <div className="home">
                <div className="container" style = {{"display": "flex",flexFlow: "column", justifyContent:'center'}}>
                    <div className="row align-items-center my-5">
                        <div className="col-lg">
                            <h1 className="font-weight-light">Webhook Tools</h1>
                            <p>
                                Allows modification of discord webhooks with ease.
                            </p>
                        </div>
                    </div>
                    <div className="row align-items-center my-5">
                        <div className="col-lg p-3" style={{background:'#ffffff11',borderRadius:'4px'}}>
                            <form style={{textAlign:'initial'}} onSubmit={(elm)=>elm.preventDefault()} >
                                <div className="form-group">
                                    <label htmlFor="URL">Webhook url</label>
                                    <input type="text" onInput={this.OnURLUpdate} onPaste={this.OnURLUpdate} className="form-control" id="URL" aria-describedby="webhook URL"/>
                                </div>
                                <div className="collapse modificationControls">
                                    <div className="form-group row">
                                        <div className="col">
                                            <label htmlFor="Content">Content</label>
                                            <textarea type="text" onInput={this.updateModificationData} onPaste={this.updateModificationData} className="form-control" id="content" aria-describedby="Content" style={{minHeight:'7rem'}} />
                                        </div>
                                        <div className="col-lg-5">
                                            <label htmlFor="name">name</label>
                                            <input type="text" onInput={this.updateModificationData} onPaste={this.updateModificationData} className="form-control" id="name" aria-describedby="webhook name"/>
                                            <label htmlFor="avatar">avatar (URL)</label>
                                            <input type="text" onInput={this.updateModificationData} onPaste={this.updateModificationData} className="form-control" id="avatar" aria-describedby="webhook avatar"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group collapse Information clearfix" ref={informationRef}>
                                    {this.createInformation()}
                                    <div className="col-lg-3 float-left">
                                        <img src={`https://cdn.discordapp.com/avatars/${this.state.webhookData?.id}/${this.state.webhookData?.avatar}.png?size=128`} alt="no avatar" />
                                    </div>
                                </div>
                                <div className="form-group clearfix row my-0" style={{display:'flex'}} >
                                    <div className="col-lg-5 collapse modificationControls" >
                                        <input type="button" onClick={this.onSend} className="btn btn-success modificationControls float-left" disabled={this.state.isUrlValid ? false : true}  value="send"/>
                                        <input type="button" onClick={this.onModify} className="btn btn-warning modificationControls float-left ml-1" disabled={this.state.isUrlValid ? false : true}  value="Modify"/>
                                    </div>
                                    <div className="col-lg float-right">
                                        <input type="button" className="btn btn-danger float-right ml-1" disabled={this.state.isUrlValid ? false : true} onClick={this.onDelete}  value="Delete"/>
                                        <input type="button" className="btn btn-info float-right" data-toggle="collapse" data-target=".modificationControls" disabled={this.state.isUrlValid ? false : true}  value="Toggle more"/>
                                    </div>
                                </div>
                                <p id = "hlp" className="text-danger d-none" > test </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default WebhookT;