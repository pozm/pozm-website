import express = require('express')
import {readdirSync} from "fs";

const TestRouter = express.Router()

TestRouter.get('/',(req,res) =>{
    res.sendStatus(200)
})
TestRouter.get('/err',(req,res,next) =>{
    next('nooo error!')
})

export {TestRouter}