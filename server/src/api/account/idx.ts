import express = require('express')
import DiscordOAuth = require("discord-oauth2")

import {RequireLoggedIn, RequireValidKey} from "../../middleWare/acc";
import {AsyncQuery, getDataFromId, getIdFromUser, UserType} from "../../utils";
import {OkPacket} from "mysql";
import {keys} from "../../keys";
import got from "got";
import crypto from "crypto";
import {con} from "../../index";
import rateLimit from "express-rate-limit";
const OAuth = new DiscordOAuth();

const limiter = rateLimit({
    windowMs: 120e3,
    max: 10 // limit each IP to 100 requests per windowMs
});

const AccountRouter = express.Router()

AccountRouter.delete('/Session', RequireLoggedIn, (req,res,next)=>{
    let cookie = (req.session as Express.Session)
        cookie.destroy(()=>{})
        res.status(200)
            .send('{}')
})

AccountRouter.get('/me', RequireLoggedIn, async (req,res) => {

    return res.json({error:false,data: {...(await getDataFromId(res.locals.userID) as UserType )}})
});

AccountRouter.delete("/", RequireLoggedIn, async (req,res)=>{
    let cookie = (req.session as Express.Session)
    let {target} = req.body
    let user = await getDataFromId(cookie.logedInto) as {[x:string]:any}
    if (!target) {await AsyncQuery("delete from \`whitelist\`.\`account\` where ID = ?", [cookie?.logedInto]); cookie?.destroy(()=>{}); return res.json({message:"Deleted account."}) }
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


AccountRouter.post('/Create', limiter,RequireValidKey, async (req,res) => {
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
        // console.log((req.session as Express.Session).logedInto)
        res.send(JSON.stringify({'message':'sucessfully logged in'}))
    }
});


AccountRouter.post('/Login', limiter, async (req,res) => {

    if (!req.body['Recaptcha']) return res.json({error:21,message:'Please complete the recaptcha'})

    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + keys.recapSiteKey + "&response=" + req.body['Recaptcha'] + "&remoteip=" + req.connection.remoteAddress;

    let resb = JSON.parse((await got(verificationUrl)).body)

    if (!resb.success) return res.status(400).json({error:21,message:'You have failed the recaptcha, try again?'})

    // req.session.cool = true
    let {UserName,Email,Password} = req.body
    if (!UserName) UserName = Email
    if (!Password) return res.status(400).send(JSON.stringify({error:19,message:'Missing credentials'}))
    if (!UserName) return res.status(400).send(JSON.stringify({error:19,message:'Missing credentials'}))
    // con.query(dataStructures.account)
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


AccountRouter.get("/linkDiscord", limiter , RequireLoggedIn , async (req,res) => {
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
        scope: ["identify"]

    }

    OAuth.tokenRequest({...Data, grantType: "authorization_code"}).then(async token => {
        let user = await OAuth.getUser(token.access_token)
        let Exists = await AsyncQuery<{[any:string]:number}[]>('select exists(select DiscordID from `whitelist`.account where DiscordID = ? and ID != ?)', [user.id, cookie?.logedInto])
        if (Exists === null)
            return res.send(`<script> window.localStorage.setItem("DiscordState","4"); window.location.replace("/") </script>`)
        if (Object.values(Exists[0])[0])
            return res.send(`<script> window.localStorage.setItem("DiscordState","4"); window.location.replace("/") </script>`)
        AsyncQuery('update `whitelist`.`account` set DiscordID = ?, DiscordUser = ?, AvatarUri=? where ID = ?',[user.id, `${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ user.avatar?.slice(0,2).toLowerCase() == "a_" ? 'gif' : 'png' }` ,cookie?.logedInto])
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
        res.send(`<script> window.localStorage.setItem("DiscordState","1"); window.location.replace("/") </script>`)

    },r => res.json({error:57,message:"invalid code / discord messed up"}))

})


AccountRouter.get("/loginWithDiscord", limiter , async (req,res) => {
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
    let Data = {
        clientId: keys.ClientId,
        clientSecret : keys.ClientSecret,
        code,
        redirectUri: keys.RedirectLoginURI,
        scope: "identify"

    }

    OAuth.tokenRequest({...Data, grantType: "authorization_code"}).then(async token => {
        console.log('aaaaaaaa',token.access_token)
        let duser = await OAuth.getUser(token.access_token)
        let auser = (await AsyncQuery<[UserType]>('select * from `whitelist`.account where DiscordID = ?', [duser.id]))
        if (auser?.length) {
            let user = auser[0]
            console.log(user);
            (req.session as Express.Session).logedInto = user.ID
            res.send(`<script> window.localStorage.setItem("DiscordState","11"); window.location.replace("/") </script>`)
        } else {
            res.send(`<script> window.localStorage.setItem("DiscordState","12"); window.location.replace("/") </script>`)

        }

    })
})


export {AccountRouter}