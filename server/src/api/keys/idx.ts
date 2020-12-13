import express = require('express')
import {readdirSync} from "fs";
import {AsyncQuery, getCreatedKeysFromId, getDataFromId, UserType, uuidv4} from "../../utils";
import {RequireAdmin, RequireCool, RequireValidKey} from "../../middleWare/acc";

const KeysRouter = express.Router()


KeysRouter.get("/", RequireAdmin, async (req,res)=>{
    let Keys = await AsyncQuery<{[x:string]:any}[]>("select * from `whitelist`.`keycode`", )
    return res.json({Keys})
})
KeysRouter.post("/CreateInvite", RequireCool, async (req,res)=>{
    let uuid = uuidv4()
    if ((await getCreatedKeysFromId(res.locals.userID) >= 2) && res.locals.userID !== 2 ) return res.json({error : 61, message:"you've already created maximum keys"})
    let user = await getDataFromId(res.locals.userID) as UserType
    await AsyncQuery('insert into `whitelist`.`keycode` (KEYID,PowerID,CreatedBy) values (?,?,?)',[uuid,0,user.ID])
    return res.json({Key:uuid,message:"Successfully created key."})
})
KeysRouter.get("/CreatedInvites", RequireCool, async (req,res)=>{
    let Keys = await AsyncQuery<{[x:string]:string}[]>('select KEYID, Registered from whitelist.keycode where CreatedBy = ?',[res.locals.userID])
    return res.json({Keys, error : false})
})
KeysRouter.post("/Create", RequireAdmin, async (req,res)=>{
    let uuid = uuidv4()
    let {Power=0} = req.body

    await AsyncQuery('insert into `whitelist`.`keycode` (KEYID,PowerID) values (?,?)',[uuid,Power ?? 0])
    return res.json({Key:uuid,Power,message:"Successfully created key."})
})
KeysRouter.put("/Modify", RequireValidKey, RequireAdmin, async (req,res)=>{
    let {Power,Key} = req.body

    await AsyncQuery('update `whitelist`.`keycode` set PowerID = ? where KEYID = ?',[Power ?? 0,Key])
    return res.json({Key,Power,message:"Successfully updated key."})
})
KeysRouter.delete("/Delete", RequireValidKey, RequireAdmin, async (req,res)=>{
    let {Key} = req.body

    await AsyncQuery('delete from `whitelist`.`keycode` where KEYID = ?',[Key])
    return res.json({message:"Successfully deleted key."})
})


export {KeysRouter}