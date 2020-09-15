"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIRouter = void 0;
const express = require("express");
const crypto = __importStar(require("crypto"));
const _1 = require(".");
const keys_1 = require("./keys");
const source_1 = __importDefault(require("got/dist/source"));
const utils_1 = require("./utils");
const APIRouter = express.Router();
exports.APIRouter = APIRouter;
APIRouter.get('/test', (req, res) => {
    console.log('working');
    res.json({ Working: true });
});
APIRouter.get('/getUser', async (req, res) => {
    let cookie = req.session?.logedInto;
    if (!cookie)
        return res.json({ error: 44, message: 'Not signed in' });
    else {
        return res.json({ error: false, data: await utils_1.getDataFromId(cookie) });
    }
});
APIRouter.post('/CreateAccount', async (req, res) => {
    if (!req.body['Recaptcha'])
        return res.json({ error: 21, message: 'Please complete the recaptcha' });
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + keys_1.keys.recapSiteKey + "&response=" + req.body['Recaptcha'] + "&remoteip=" + req.connection.remoteAddress;
    let resb = JSON.parse((await source_1.default(verificationUrl)).body);
    if (!resb.success)
        return res.status(400).json({ error: 21, message: 'You have failed the recaptcha, try again?' });
    let { UserName, Password, Email, key } = req.body;
    if (!UserName || !Password || !Email || !key)
        return res.status(400).send(JSON.stringify({ error: 19, message: 'Missing credentials' }));
    if (!Email.match(/.{0,64}[@](\w{0,255}[.])\w{0,10}/))
        return res.status(400).send(JSON.stringify({ 'error': 3, message: 'bad email' }));
    if (UserName.match(/(.{30,}|[^A-Za-z\d])/))
        return res.status(400).send(JSON.stringify({ 'error': 4, message: 'bad username' }));
    if (!Password.match(/^[\x00-\x7F]{8,32}$/i))
        return res.status(400).send(JSON.stringify({ 'error': 7, message: 'password is invalid (bad)' }));
    let keydata = await utils_1.AsyncQuery('select `KEYID`,`PowerID` from `whitelist`.`keycode` where `KEYID` = ? and Registered=0', key);
    console.log(keydata, key);
    if (!keydata[0])
        return res.status(400).json({ error: 9, message: 'invalid key' });
    _1.con.query('select * from `whitelist`.`account` where Username = ? or Email = ?', [UserName, Email], async (err, resu) => {
        if (err)
            throw err;
        if (0 in resu) {
            return res.status(400).send(JSON.stringify({ 'error': 10, message: `${0 in resu.filter((v) => v.email == Email) ? 'Email' : 'Username'} is already in use.` }));
        }
        else {
            let hash = crypto.createHash('sha512').update(Password);
            _1.con.query('insert into \`whitelist\`.\`account\` (Username,Password,Email,RegisteredIP,LastIP, KEYID,PowerID) values (?, ?, ?, ?,?,?,?)', [UserName, hash.digest('hex'), Email, req.ip, req.ip, key, keydata[0]?.PowerID ?? 0]);
            _1.con.query('update `whitelist`.`keycode` set Registered=1,CreatedAT=current_timestamp where KEYID=?', key);
            req.session.logedInto = await utils_1.getIdFromUser(UserName);
            res.send(JSON.stringify({ 'message': 'sucessfully logged in' }));
        }
    });
});
APIRouter.post('/LogintoAccount', async (req, res) => {
    if (!req.body['Recaptcha'])
        return res.json({ error: 21, message: 'Please complete the recaptcha' });
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + keys_1.keys.recapSiteKey + "&response=" + req.body['Recaptcha'] + "&remoteip=" + req.connection.remoteAddress;
    let resb = JSON.parse((await source_1.default(verificationUrl)).body);
    if (!resb.success)
        return res.status(400).json({ error: 21, message: 'You have failed the recaptcha, try again?' });
    // req.session.cool = true
    let { UserName, Email, Password } = req.body;
    if (!UserName)
        UserName = Email;
    if (!Password)
        return res.status(400).send(JSON.stringify({ error: 19, message: 'Missing credentials' }));
    if (!UserName)
        return res.status(400).send(JSON.stringify({ error: 19, message: 'Missing credentials' }));
    _1.con.query(_1.dataStructures.account);
    let hash = crypto.createHash('sha512')
        .update(Password);
    let digested = hash.digest('hex');
    _1.con.query('select * from `whitelist`.`account` where Password = ? and (Username = ? or Email = ?)', [digested, UserName ?? '', UserName ?? ''], (err, resi) => {
        if (err)
            throw err;
        if (0 in resi) {
            req.session.logedInto = resi[0].ID;
            console.log(req.session.logedInto);
            res.send(JSON.stringify({ error: false, message: 'Logged in' }));
        }
        else {
            res.status(401).json({ error: 6, message: 'Invalid credentials' });
        }
    });
});
APIRouter.delete('/killSession', (req, res) => {
    let cookie = req.session;
    if (!cookie)
        return res.json({ error: 44, message: 'Not signed in' });
    else {
        cookie.destroy(() => { });
        res.status(200)
            .send('{}');
    }
});
