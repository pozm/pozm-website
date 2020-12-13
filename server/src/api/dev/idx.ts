import express = require('express')
import {readdirSync} from "fs";
import {AsyncQuery} from "../../utils";
import {RequireValidAPIKey} from "../../middleWare/acc";

const DevRouter = express.Router()

DevRouter.get('/hentai', RequireValidAPIKey, async (req,res,next) => {
    let {type,amount} = req.query
    if (!type) return res.json({error:85,message:"invalid type"})
    if (!amount) return res.json({error:85,message:"invalid amount"});
    if (Number(amount ?? 0) > 30) return res.json({error:85,message:"amount is too large"})
    if (Number(amount ?? 0) < 0)  return res.json({error:85,message:"amount is too small"})
    let ParsedAmount = Number(amount)
    let Resp = await AsyncQuery< {Url:string}[]>(`select Url from Images.Hentai where Type = ? ORDER BY RAND() limit ?;`, [type,ParsedAmount] )
    if (!Resp) return next('Response is invalid?')
    // console.log(Resp)
    res.json({error : false, data : {files : Resp.map(v=>v.Url)}})
})

export {DevRouter}