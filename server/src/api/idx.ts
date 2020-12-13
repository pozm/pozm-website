import express = require('express')
import {readdirSync} from "fs";
import {KeysRouter} from "./keys/idx";
import {AccountRouter} from "./account/idx";
import {DevRouter} from "./dev/idx";
import {UsersRouter} from "./users/idx";
import {TestRouter} from "./test/idx";
import {ContentRouter} from "./content/idx";

const APIRouter = express.Router()

//Api endpoints

APIRouter.use('/Keys',KeysRouter)
APIRouter.use('/Account',AccountRouter)
APIRouter.use('/Dev',DevRouter)
APIRouter.use('/Users',UsersRouter)
APIRouter.use('/Test',TestRouter)
APIRouter.use('/Content',ContentRouter)

//catch errors

APIRouter.use((err: express.ErrorRequestHandler, req :express.Request, res: express.Response, next : express.NextFunction) => {
    console.error(`Got error from ${req.originalUrl} : ${err}`)
    res.status(500).json({error:3,message:"Something went wrong?", errMessage:err})
})

//catch 404

APIRouter.all("/*",(req,res)=>{
    res.status(404).json({error:1,message:"invalid endpoint"})
})

export {APIRouter}