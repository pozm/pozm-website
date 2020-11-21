import express = require('express')
import * as crypto from "crypto"
import { con, dataStructures } from '.';
import { keys } from './keys';
import got from 'got/dist/source';
import {
    AsyncQuery,
    CheckIfKeyExists,
    getCreatedKeysFromId,
    getDataFromId,
    getIdFromUser,
    GetType,
    UserType,
    uuidv4
} from './utils';
import { readFile } from 'fs/promises';
import {OkPacket} from "mysql";
import {NextFunction} from "express";
import DiscordOAuth = require("discord-oauth2")
const OAuth = new DiscordOAuth();
const APIRouter = express.Router()

//#region pretty cool...

//#endregion


//region Middle ware
async function RequireAdmin(req: express.Request,res:express.Response, next : NextFunction) {
    let cookie = (req.session as Express.Session)
    if (!cookie?.logedInto) return res.json({error:44,message:'Not signed in'})
    let user = await getDataFromId(cookie.logedInto) as {[x:string]:any}
    if (user?.PowerID < 5) return res.json({error:45,message:'insufficient power'})
    next()
}
async function RequireCool(req: express.Request,res:express.Response, next : NextFunction) {
    let cookie = (req.session as Express.Session)
    if (!cookie?.logedInto) return res.json({error:44,message:'Not signed in'})
    let user = await getDataFromId(cookie.logedInto) as {[x:string]:any}
    if (user?.PowerID < 1) return res.json({error:45,message:'insufficient power'})
    res.locals.userID = cookie?.logedInto
    next()
}
async function RequireLoggedIn(req: express.Request,res:express.Response, next : NextFunction) {
    let cookie = (req.session as Express.Session)
    if (!cookie?.logedInto) return res.json({error:44,message:'Not signed in'})
    res.locals.userID = cookie?.logedInto
    next()
}
async function RequireValidKey(req: express.Request,res:express.Response, next : NextFunction) {
    let {Key} = req.body
    if (!Key) return res.json({error: 83, message: "Invalid key provided."})
    if(!await CheckIfKeyExists(Key)) return res.json({error: 83, message: "Invalid key provided."})
    else next();
}
async function RequireValidUser(req: express.Request,res:express.Response, next : NextFunction) {
    let {User} = req.params
    if (!User) return res.json({error:76,message:"Invalid user"})
    else {
        let data = await getDataFromId(User)
        if (!data) return res.json({error:76,message:"Invalid user"})
        res.locals.User = data
        next();
    }
}

//endregion

let blData = {
    Users : ["608778876939665449"],
    Guilds : []
}
APIRouter.get("/Blacklist_bot",(req,res)=>{
    console.log(req.ip)
    if (["127.0.0.1","::1"].includes(req.ip)) {
        res.json(blData)
    }
})

APIRouter.get("/linkDiscord", RequireLoggedIn , async (req,res) => {
    let code = req.query["code"]
    if (!code)
        return res.json({
            error:56,
            message:"missing code."
        })
    if (typeof code !== "string")
        return res.json({
            error:57,
            message:"invalid code."
        })
    let cookie = (req.session as Express.Session)
    let Data = {
        clientId: keys.ClientId,
        clientSecret : keys.ClientSecret,
        code,
        redirectUri: keys.RedirectURI,
        scope: ["guilds.join","identify"]

    }

    OAuth.tokenRequest({...Data, grantType: "authorization_code"}).then(async token => {
        let user = await OAuth.getUser(token.access_token)
        let Exists = await AsyncQuery<{[any:string]:number}[]>('select exists(select DiscordID from `whitelist`.account where DiscordID = ? and ID != ?)', [user.id, cookie?.logedInto])
        if (Exists === null)
            return res.send(`<script> window.localStorage.setItem("DiscordState","4"); window.location.replace("/") </script>`)
        if (Object.values(Exists[0])[0])
            return res.send(`<script> window.localStorage.setItem("DiscordState","4"); window.location.replace("/") </script>`)
        AsyncQuery('update `whitelist`.`account` set DiscordID = ?, DiscordUser = ?, AvatarUri=? where ID = ?',[user.id, `${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` ,cookie?.logedInto])
        let dbUser = await getDataFromId(cookie?.logedInto) as UserType
        let roles = ["768251889845796936"]
        switch (dbUser.PowerID) {
            case 5:
                roles.push("768892121842712576")
                break;
            case 1:
                roles.push("768252299461394443")
                break;
        }


        OAuth.addMember({
            accessToken: token.access_token,
            guildId : "767828264281440277",
            roles,
            userId: user.id,
            botToken : keys.BotToken
        }).then(member=>{
            res.send(`<script> window.localStorage.setItem("DiscordState","1"); window.location.replace("/") </script>`)
        }, (reason : Error) => {
            res.send(`<script> window.localStorage.setItem("DiscordState",${reason.message.indexOf("banned") >= 1 ? "2" : "3"}); window.location.replace("/") </script>`)
        })
        // res.json({
        //     message:"Successfully linked"
        // })

    },r => res.json({error:57,message:"invalid code / discord messed up"}))



    //await AsyncQuery('update `whitelist`.`account` set DiscordID = ? where ID = ?',[id,2])
})
APIRouter.get("/users", async (req,res) => {
    let users = await AsyncQuery('select ID,AvatarUri,Username,PowerID from whitelist.account')
    return res.json({error:false,data: users})
})
APIRouter.get("/user/:User", RequireValidUser, (req,res) => {
    let {Username,AvatarUri,RegisteredAT,PowerID, InvitedBy } = res.locals.User as UserType
    return res.json({error:false,data: {Username,AvatarUri,RegisteredAT,PowerID,InvitedBy}})
})
APIRouter.put("/user/:User", RequireValidUser , RequireAdmin, async (req,res) => {
    let {power} = req.body
    if (res.locals.User.ID === 2) return;
    let out = await AsyncQuery('update `whitelist`.`account` set PowerID = ? where ID = ?', [power,res.locals.User.ID]).catch(r=>false)
    if (!out) res.json({error:45,message:"something went wrong?"})
    return res.json({error:false,message:"updated!"})
})


APIRouter.get('/getUser', RequireLoggedIn, async (req,res) => {
    let cookie = (req.session as Express.Session)?.logedInto
    return res.json({error:false,data: {...(await getDataFromId(cookie) as UserType ), CreatedInvites: await getCreatedKeysFromId(cookie) } })
});

APIRouter.post("/theCol", RequireLoggedIn, async (req,res) => {
    let {id,type} = req.body
    console.log("b")
    let Resp = await AsyncQuery<[ {Url:string}[], {Type:string}[],{'count(*)':number}[]  ]>(`select Url from Images.Hentai where Type = ? ORDER BY ID DESC limit 50 offset ?; select distinct Type from Images.Hentai;select count(*) from Images.Hentai where Type = ?`, [type,id*50,type] )
    console.log(Resp)
    if (!Resp) return res.json({error : 26, message: "what"}) ;
    console.log(Resp[0].map(v=> v.Url ), Resp[1][0].Type, Resp[2][0]['count(*)']  )
    return res.json({Files:Resp[0].map(v=> v.Url ), Fit:Math.round(Resp[2][0]['count(*)']/50), types:Resp[1].map(v=>v.Type)})
})
APIRouter.get("/adminData", RequireAdmin, async(req,res)=>{
    let users = await AsyncQuery<{[x:string]:any}[]>("select *, NULL as password from `whitelist`.`account`", [])
    let Keys = await AsyncQuery<{[x:string]:any}[]>("select * from `whitelist`.`keycode`", )
    return res.json({users,Keys})
})

//#region keys
APIRouter.get("/Keys", RequireAdmin, async (req,res)=>{
    let Keys = await AsyncQuery<{[x:string]:any}[]>("select * from `whitelist`.`keycode`", )
    return res.json({Keys})
})
APIRouter.post("/Keys/CreateInvite", RequireCool, async (req,res)=>{
    let uuid = uuidv4()
    if ((await getCreatedKeysFromId(res.locals.userID) >= 2) && res.locals.userID !== 2 ) return res.json({error : 61, message:"you've already created maximum keys"})
    let user = await getDataFromId(res.locals.userID) as UserType
    await AsyncQuery('insert into `whitelist`.`keycode` (KEYID,PowerID,CreatedBy) values (?,?,?)',[uuid,0,user.ID])
    return res.json({Key:uuid,message:"Successfully created key."})
})
APIRouter.get("/Keys/CreatedInvites", RequireCool, async (req,res)=>{
    let Keys = await AsyncQuery<{[x:string]:string}[]>('select KEYID, Registered from whitelist.keycode where CreatedBy = ?',[res.locals.userID])
    return res.json({Keys, error : false})
})
APIRouter.post("/Keys/CreateKey", RequireAdmin, async (req,res)=>{
    let uuid = uuidv4()
    let {Power=0} = req.body

    await AsyncQuery('insert into `whitelist`.`keycode` (KEYID,PowerID) values (?,?)',[uuid,Power ?? 0])
    return res.json({Key:uuid,Power,message:"Successfully created key."})
})
APIRouter.put("/Keys/ModifyKey", RequireValidKey, RequireAdmin, async (req,res)=>{
    let {Power,Key} = req.body

    await AsyncQuery('update `whitelist`.`keycode` set PowerID = ? where KEYID = ?',[Power ?? 0,Key])
    return res.json({Key,Power,message:"Successfully updated key."})
})
APIRouter.delete("/Keys/DeleteKey", RequireValidKey, RequireAdmin, async (req,res)=>{
    let {Key} = req.body

    await AsyncQuery('delete from `whitelist`.`keycode` where KEYID = ?',[Key])
    return res.json({message:"Successfully deleted key."})
})
//#endregion

APIRouter.delete("/account", async (req,res)=>{
    let cookie = (req.session as Express.Session)
    if (!cookie?.logedInto) return res.json({error:44,message:'Not signed in'})
    let {target} = req.body
    let user = await getDataFromId(cookie.logedInto) as {[x:string]:any}
    if (!target) {await AsyncQuery("delete from \`whitelist\`.\`account\` where ID = ?", [cookie?.logedInto]); cookie?.destroy(()=>{});res.json({message:"Deleted account."}) }
    if (user?.PowerID < 5 && target) return res.json({error:44,message:'insufficient power'})
    else {
        let output = await AsyncQuery<OkPacket>("delete from \`whitelist\`.\`account\` where ID = ?", [target])
        console.log(output)
        if (output?.affectedRows) {
            res.json({message:`Deleted id : ${target}`})
        } else {
            res.json({ error:525, message:`Unable to find id : ${target}`})
        }
    }
})

APIRouter.post('/CreateAccount',RequireValidKey, async (req,res) => {
    let ip = req.ip
    if (!req.body['Recaptcha']) return res.json({error:21,message:'Please complete the recaptcha'})

    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + keys.recapSiteKey + "&response=" + req.body['Recaptcha'] + "&remoteip=" + req.connection.remoteAddress;

    let resb = JSON.parse((await got(verificationUrl)).body)

    if (!resb.success) return res.status(400).json({error:21,message:'You have failed the recaptcha, try again?'})

    let {UserName,Password,Email,Key} = req.body
    if (! UserName||!Password||!Email||!Key) return res.status(400).send(JSON.stringify({error:19,message:'Missing credentials'}))

    if (!Email.match(/.{0,64}[@](\w{0,255}[.])\w{0,10}/)) return res.status(400).send(JSON.stringify({'error':3,message:'bad email'}))
    if (UserName.match(/(.{30,}|[^A-Za-z\d])/)) return res.status(400).send(JSON.stringify({'error':4,message:'bad username'}))
    if (!Password.match(/^[\x00-\x7F]{8,132}$/i)) return res.status(400).send(JSON.stringify({'error':7,message:'password is invalid (bad)'}))
    let keydata = await AsyncQuery<{KEYID:string,PowerID:number,CreatedBy:string}[]>('select `KEYID`,`PowerID`,CreatedBy from `whitelist`.`keycode` where `KEYID` = ? and Registered=0', [Key])
    if (!keydata || keydata === [] || keydata.length === 0 ) {
        return res.status(400).json({error:9,message:'invalid key'})
    }
    else {
        let Exists = await AsyncQuery<{[any:string]:number}[]>('select exists(select * from `whitelist`.`account` where Username = ? or Email = ?)', [UserName,Email])
        console.log(Object.values((Exists ?? [{}] )[0] ?? {})[0])
        if (Exists === null)
            return res.status(400).send(JSON.stringify({'error' : 103, message: `Email / Username is already in use.`}))
        if (Object.values(Exists[0])[0])
            return res.status(400).send(JSON.stringify({'error' : 10, message: `Email / Username is already in use.`}))
        let hash = crypto.createHash('sha512').update(Password);
        let hashedIp = crypto.createHash('sha512').update(req.ip).digest('hex');
        await AsyncQuery(`insert into \`whitelist\`.\`account\` (Username,Password,Email,RegisteredIP,LastIP, KEYID,PowerID,InvitedBy) values (?, ?, ?, ?,?,?,?,?); 
            update \`whitelist\`.\`keycode\` set Registered=1,RegisteredAT=current_timestamp where KEYID=?;`,
            [UserName,hash.digest('hex'),Email, hashedIp,hashedIp,Key,keydata[0]?.PowerID ?? 0,keydata[0]?.CreatedBy,Key]);
        // con.query('update `whitelist`.`keycode` set Registered=1,CreatedAT=current_timestamp where KEYID=?', key);
        (req.session as Express.Session).logedInto = await getIdFromUser(UserName)
        console.log((req.session as Express.Session).logedInto)
        res.send(JSON.stringify({'message':'sucessfully logged in'}))
    }
});


APIRouter.post('/LogintoAccount', async (req,res) => {
    
    if (!req.body['Recaptcha']) return res.json({error:21,message:'Please complete the recaptcha'})

    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + keys.recapSiteKey + "&response=" + req.body['Recaptcha'] + "&remoteip=" + req.connection.remoteAddress;

    let resb = JSON.parse((await got(verificationUrl)).body)

    if (!resb.success) return res.status(400).json({error:21,message:'You have failed the recaptcha, try again?'})

    // req.session.cool = true
    let {UserName,Email,Password} = req.body
    if (!UserName) UserName = Email
    if (!Password) return res.status(400).send(JSON.stringify({error:19,message:'Missing credentials'}))
    if (!UserName) return res.status(400).send(JSON.stringify({error:19,message:'Missing credentials'}))
    con.query(dataStructures.account)
    let hash = crypto.createHash('sha512')
        .update(Password)
    let digested = hash.digest('hex')
    con.query('select * from `whitelist`.`account` where Password = ? and (Username = ? or Email = ?)', [digested, UserName ?? '', UserName ?? ''], (err,resi) => {
        if (err) throw err
        if (0 in resi) {
            (req.session as Express.Session).logedInto = resi[0].ID
            console.log((req.session as Express.Session).logedInto)
            res.send(JSON.stringify({error : false, message : 'Logged in'}))
        }
        else {
            res.status(401).json({error:6, message:'Invalid credentials'})
        }
    })
})

APIRouter.delete('/killSession', RequireLoggedIn, (req,res)=>{
    let cookie = (req.session as Express.Session)
    if (!cookie?.logedInto) return res.json({error:44,message:'Not signed in'})
    else {
        cookie.destroy(()=>{})
        res.status(200)
            .send('{}')
    }
})


APIRouter.all("/*",(req,res)=>{
    res.json({error:82,message:"invalid endpoint"})
})


export {APIRouter}