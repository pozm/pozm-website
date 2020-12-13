import express = require('express')
import {AsyncQuery} from "../../utils";
import {RequireAdmin, RequireLoggedIn} from "../../middleWare/acc";


const ContentRouter = express.Router()

ContentRouter.post("/theCol", RequireLoggedIn, async (req,res,next) => {
    let {id,type} = req.body
    let Resp = await AsyncQuery<[ {Url:string}[], {Type:string}[],{'count(*)':number}[]  ]>(`select concat(Url, ? , 'width=',Width div 2,'&height=',Height div 2) as Url from Images.Hentai where Type = ? ORDER BY ID DESC limit 50 offset ?; select distinct Type from Images.Hentai;select count(*) from Images.Hentai where Type = ?`, ['?',type,id*50,type] )
    if (!Resp) return next('Response is invalid?')
    // console.log(Resp[0].map(v=> v.Url ), Resp[1][0].Type, Resp[2][0]['count(*)']  )
    return res.json({Files:Resp[0].map(v=> v.Url ), Fit:Math.round(Resp[2][0]['count(*)']/50), types:Resp[1].map(v=>v.Type)})
})
ContentRouter.get("/admin", RequireAdmin, async(req,res,next)=>{
    let data = await AsyncQuery<{[x:string]:any}[]>("select *, NULL as password from `whitelist`.`account`; select * from whitelist.keycode", [])
    if (!data) return next('no data?')
    let d = {users:data[0],Keys:data[1]}
    // let Keys = await AsyncQuery<{[x:string]:any}[]>("select * from `whitelist`.`keycode`", )
    return res.json(d)
})

export {ContentRouter}