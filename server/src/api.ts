import express = require('express')
import * as crypto from "crypto"
import { asyncQuery, con, dataStructures } from '.';
import { keys } from './keys';
import got from 'got/dist/source';
import { AsyncQuery, getDataFromId, getIdFromUser } from './utils';
import { readFile } from 'fs/promises';
const APIRouter = express.Router()

//#region pretty cool...
let theFile : {[x:string] : string[]}

function updateTheFile() {
    readFile("./server/hData.json").then(txt => {
        let jsn = JSON.parse(txt.toString())
        theFile = theFile === jsn ? theFile : jsn
        for (let [key,val] of Object.entries(theFile)) {
            theFile[key] = val.reverse()
        }
    })
}
updateTheFile()
setInterval(updateTheFile,1e3*60)
APIRouter.get('/test', (req,res) => {
    console.log('working');
    res.json({Working:true})
});
//#endregion

APIRouter.get('/getUser', async (req,res) => {
    let cookie = (req.session as Express.Session)?.logedInto
    if (!cookie) return res.json({error:44,message:'Not signed in'})
    else {
        return res.json({error:false,data:await getDataFromId(cookie)})
    }
});
APIRouter.post("/theCol", async (req,res) => {

    let cookie = (req.session as Express.Session)
    if (!cookie?.logedInto) return res.json({error:44,message:'Not signed in'})
    let {id,type} = req.body
    return res.json({Files:theFile[type ?? "Normal"].slice(id*20,id*20+20), Fit:Math.ceil(theFile[type ?? "Normal"].length/20), types:Object.keys(theFile)})
})
APIRouter.get("/adminData", async(req,res)=>{
    let cookie = (req.session as Express.Session)
    if (!cookie?.logedInto) return res.json({error:44,message:'Not signed in'})
    let user = await getDataFromId(cookie.logedInto) as {[x:string]:any}
    if (user?.PowerID < 5) return res.json({error:44,message:'insufficient power'})

    let users = await AsyncQuery<{[x:string]:any}[]>("select *, NULL as password from `whitelist`.`account`", [])
    return res.json({users})
})
APIRouter.post('/CreateAccount', async (req,res) => {
    let ip = req.ip
    if (!req.body['Recaptcha']) return res.json({error:21,message:'Please complete the recaptcha'})

    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + keys.recapSiteKey + "&response=" + req.body['Recaptcha'] + "&remoteip=" + req.connection.remoteAddress;

    let resb = JSON.parse((await got(verificationUrl)).body)

    if (!resb.success) return res.status(400).json({error:21,message:'You have failed the recaptcha, try again?'})

    let {UserName,Password,Email,key} = req.body
    if (! UserName||!Password||!Email||!key) return res.status(400).send(JSON.stringify({error:19,message:'Missing credentials'}))

    if (!Email.match(/.{0,64}[@](\w{0,255}[.])\w{0,10}/)) return res.status(400).send(JSON.stringify({'error':3,message:'bad email'}))
    if (UserName.match(/(.{30,}|[^A-Za-z\d])/)) return res.status(400).send(JSON.stringify({'error':4,message:'bad username'}))
    if (!Password.match(/^[\x00-\x7F]{8,132}$/i)) return res.status(400).send(JSON.stringify({'error':7,message:'password is invalid (bad)'}))
    let keydata = await AsyncQuery<{KEYID:string,PowerID:number}>('select `KEYID`,`PowerID` from `whitelist`.`keycode` where `KEYID` = ? and Registered=0', key)
    console.log(keydata,key)
    if (!keydata[0]) return res.status(400).json({error:9,message:'invalid key'})
    con.query('select * from `whitelist`.`account` where Username = ? or Email = ?', [UserName,Email], async (err , resu) => {

        if (err) throw err
        if (0 in resu) {

            return res.status(400).send(JSON.stringify({'error' : 10, message: `${0 in resu.filter((v:any) => v.email == Email) ? 'Email' : 'Username'} is already in use.`}))

        }
        else {
            // let encEmail = crypto.createCipheriv("aes-256-gcm", keys.EncryptionBase+UserName,Email)
            let hash = crypto.createHash('sha512').update(Password);
            let hashedIp = crypto.createHash('sha512').update(req.ip).digest('hex');
            await AsyncQuery('insert into \`whitelist\`.\`account\` (Username,Password,Email,RegisteredIP,LastIP, KEYID,PowerID) values (?, ?, ?, ?,?,?,?)', [UserName,hash.digest('hex'),Email, hashedIp,hashedIp,key,keydata[0]?.PowerID ?? 0]);
            con.query('update `whitelist`.`keycode` set Registered=1,CreatedAT=current_timestamp where KEYID=?', key);
            (req.session as Express.Session).logedInto = await getIdFromUser(UserName)
            console.log((req.session as Express.Session).logedInto)
            res.send(JSON.stringify({'message':'sucessfully logged in'}))

        }

    })
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

APIRouter.delete('/killSession', (req,res)=>{
    let cookie = (req.session as Express.Session)
    if (!cookie?.logedInto) return res.json({error:44,message:'Not signed in'})
    else {
        cookie.destroy(()=>{})
        res.status(200)
            .send('{}')
    }
})

export {APIRouter}