import {NextFunction} from "express";
import {AsyncQuery, CheckIfKeyExists, getDataFromId} from "../utils";
import express = require('express')



async function RequireAdmin(req: express.Request,res:express.Response, next : NextFunction) {
    let cookie = (req.session as Express.Session)
    if (!cookie?.logedInto) return res.json({error:4,message:'Not signed in'})
    let user = await getDataFromId(cookie.logedInto) as {[x:string]:any}
    if (user?.PowerID < 5) return res.json({error:5,message:'insufficient power'})
    next()
}
async function RequireCool(req: express.Request,res:express.Response, next : NextFunction) {
    let cookie = (req.session as Express.Session)
    if (!cookie?.logedInto) return res.json({error:4,message:'Not signed in'})
    let user = await getDataFromId(cookie.logedInto) as {[x:string]:any}
    if (user?.PowerID < 1) return res.json({error:5,message:'insufficient power'})
    res.locals.userID = cookie?.logedInto
    next()
}
async function RequireLoggedIn(req: express.Request,res:express.Response, next : NextFunction) {
    let cookie = (req.session as Express.Session)
    if (!cookie?.logedInto) return res.json({error:4,message:'Not signed in'})
    res.locals.userID = cookie?.logedInto
    next()
}
async function RequireValidKey(req: express.Request,res:express.Response, next : NextFunction) {
    let {Key} = req.body
    if (!Key) return res.json({error: 6, message: "Invalid key provided."})
    if(!await CheckIfKeyExists(Key)) return res.json({error: 83, message: "Invalid key provided."})
    else next();
}
async function RequireValidAPIKey(req: express.Request,res:express.Response, next : NextFunction) {
    let apikey = req.header("api-key")
    if (!apikey) return res.json({error:7,message:"Invalid api key."})
    let data =await AsyncQuery<{Banned:0|1}[]>(`select Banned,acc.* from whitelist.apikey inner join whitelist.account as acc on acc.ID = UserID where UniqueValue = ?`,[apikey]);
    if (!data) return res.json({error : 26, message: "what"}) ;

    if (data[0] === undefined || data[0] === null) return res.json({error:7,message:"Invalid api key."})
    if (data[0].Banned) return res.json({error:8,message:"API key is banned."})

    res.locals.apiUser = data[0]

    next();
}
async function RequireValidUser(req: express.Request,res:express.Response, next : NextFunction) {
    let {User} = req.params
    if (!User) return res.json({error:9,message:"Invalid user"})
    else {
        let data = await getDataFromId(User)
        if (!data) return res.json({error:9,message:"Invalid user"})
        res.locals.User = data
        next();
    }
}

export {RequireAdmin,RequireCool,RequireLoggedIn,RequireValidAPIKey,RequireValidKey,RequireValidUser}