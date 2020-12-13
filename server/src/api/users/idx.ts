import express = require('express')
import {readdirSync} from "fs";
import {AsyncQuery, UserType} from "../../utils";
import {RequireAdmin, RequireValidUser} from "../../middleWare/acc";

const UsersRouter = express.Router()

UsersRouter.get("/", async (req,res) => {
    let {o=0,r,a=1,p = 'nop'} = req.query
    if (a > 20) return res.json({error:85,message:"amount is too large"})
    if (isNaN(Number(a))) return res.json({error:85,message:"invalid amount"})
    if (typeof p !== "string") return res.json({error:85,message:"invalid type"})
    let idxk_ = p.lastIndexOf('-')
    let idxk = p.slice(0, idxk_ <= 0 ? p.length : idxk_)
    let idxv = p.slice(idxk.length+1)
    let resp
    switch (idxk) {
        case 'nop':
            resp = await AsyncQuery<[any[],{'count(*)':number}[]]>(`select ID,AvatarUri,Username,PowerID from whitelist.account order by ${r ? 'RAND()' : 'ID'} limit ? offset ?; select count(*) from whitelist.account`,[Number(a),o])
            if (!resp) return res.json({error : 26, message: "what"}) ;
            break;
        case 'eq':
            resp = await AsyncQuery<[any[],{'count(*)':number}[]]>(`select ID,AvatarUri,Username,PowerID from whitelist.account where PowerID = ? order by ${r ? 'RAND()' : 'ID'} limit ? offset ?; select count(*) from whitelist.account`,[idxv,Number(a),o])
            if (!resp) return res.json({error : 26, message: "what"}) ;
            break;
        case 'gt':
            resp = await AsyncQuery<[any[],{'count(*)':number}[]]>(`select ID,AvatarUri,Username,PowerID from whitelist.account where PowerID > ? order by ${r ? 'RAND()' : 'ID'} limit ? offset ?; select count(*) from whitelist.account`,[idxv,Number(a),o])
            if (!resp) return res.json({error : 26, message: "what"}) ;
            break;
        case 'lt':
            resp = await AsyncQuery<[any[],{'count(*)':number}[]]>(`select ID,AvatarUri,Username,PowerID from whitelist.account where PowerID < ? order by ${r ? 'RAND()' : 'ID'} limit ? offset ?; select count(*) from whitelist.account`,[idxv,Number(a),o])
            if (!resp) return res.json({error : 26, message: "what"}) ;
            break;
    }
    if (!resp) return res.json({error : 26, message: "what"}) ;
    return res.json({error:false,data: {users:(resp ?? [])[0],pages: Math.ceil(resp[1][0]["count(*)"]/20),total : resp[1][0]["count(*)"] } })
})
UsersRouter.get("/:User", RequireValidUser, (req,res) => {
    let {Username,AvatarUri,RegisteredAT,PowerID, InvitedBy } = res.locals.User as UserType
    return res.json({error:false,data: {Username,AvatarUri,RegisteredAT,PowerID,InvitedBy}})
})
UsersRouter.put("/:User", RequireValidUser , RequireAdmin, async (req,res,next) => {
    let {power} = req.body
    if (res.locals.User.ID === 2) return;
    let out = await AsyncQuery('update `whitelist`.`account` set PowerID = ? where ID = ?', [power,res.locals.User.ID]).catch(r=>false)
    if (!out) return next('Response is invalid?')
    return res.json({error:false,message:"updated!"})
})

export {UsersRouter}