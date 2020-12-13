import { json, urlencoded } from "body-parser";
import {Connection, ConnectionConfig, createConnection} from "mysql";
import { join } from "path";
import rateLimit from "express-rate-limit"
import { APIRouter } from "./api/idx";
import { keys } from "./keys";
import express = require("express");
let app = express();
import multer = require("multer");
let upload = multer();
import session = require("express-session");
import {getCreatedKeysFromId, GetType, uuidv4} from "./utils";
let MySQLStore = require("express-mysql-session")(session);
const limiter = rateLimit({
    windowMs: 60e3,
    max: 100 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use("/api",limiter);

app.use(json({ limit: "10kb", type: "*/*" }));
app.use(urlencoded({ extended: false, limit: "10kb", parameterLimit: 100 }));
app.use(upload.array("/uploads"));
app.set("trust proxy", true);

var sessionStore = new MySQLStore({
  host: "localhost",
  port: 3306,
  user: "root",
  password: keys.mysqlPassWord,
  database: "sessions",
});

app.use(
  session({
    store: sessionStore,
    secret: keys.SessionKey,
    resave: true,
    saveUninitialized: false,
    cookie: {
        secure: "auto",
        expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * (365 * 3)),
        domain : GetType() ?"pozm.pw" : "localhost"
    },
    name: "session",
  })
);


const db_config : string | ConnectionConfig = {
    host: "localhost",
    user: "root",
    password: keys.mysqlPassWord,
    multipleStatements: true
  }

var con: Connection;

function handleDisconnect(doSkip? : number) { // basically lazy disconnect handling
  if (!doSkip) con = createConnection(db_config);
                                  

  con.connect(function(err) {             
    if(err) {                             
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); 
    }                                     
  });                                                                         
  con.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();                        
    } else {                                     
      throw err;                                 
    }
  });
}
con = createConnection(db_config);
handleDisconnect(1);

let type = GetType();

console.log("pre : " + type);

// Routes

app.use("/api", APIRouter);
app.locals.CurrentContext = type
if (type) {

    // app.all(/.*/,(req,res,next)=>{
    //     res.header('')
    // })

    app.all(/.*/, function(req, res, next) {
        let host = req.header("host");
        if (host?.match(/^www\..*/i) || host?.includes("localhost")) {
            next();
        } else {
            console.log(host?.includes("localhost"))
            if (host?.includes("localhost")) return next();
            res.redirect(301, "http://www." + host + req.path);
        }
    });
    app.use(express.static(join(__dirname, "../../client/build")));
    app.get("/*", (req, res) => {
        res.header("Access-Control-Allow-Origin","*.pozm.pw")
        res.sendFile(join(__dirname, "../../client/build/index.html"));
    });
}

app.use(function (err: express.ErrorRequestHandler, req :express.Request, res: express.Response, next : express.NextFunction) {
    console.error(err)
    res.status(500).send('what')
})

app.listen(type ? 80 : 5000, () =>
  console.log(`server listening on port ${type ? 80 : 5000}`)
);

export { con };
