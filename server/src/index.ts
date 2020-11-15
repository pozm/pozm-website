import { json, urlencoded } from "body-parser";
import {Connection, ConnectionConfig, createConnection} from "mysql";
import { join } from "path";
import rateLimit from "express-rate-limit"
import { APIRouter } from "./api";
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
        expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30000),
        path: "/",
        domain : GetType() ?".pozm.pw" : "localhost"
    },
    name: "session",
  })
);

const dataStructures = {
  account: `CREATE TABLE if not exists \`whitelist\`.\`account\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`username\` varchar(15) NOT NULL,
        \`password\` text NOT NULL,
        \`email\` text NOT NULL,
        \`registeredAt\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        \`powerId\` int NOT NULL DEFAULT '0',
        \`subscriptions\` json,
        PRIMARY KEY (\`id\`)
    )`,
  accountPWReset: `create table if not exists \`whitelist\`.\`PWreset\`(
        \`id\` varchar(255) NOT NULL,
        \`userid\` INT NOT NULL,
        \`expires\` DATE NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`id_UNIQUE\` (\`id\` ASC),
        UNIQUE INDEX \`userid_UNIQUE\` (\`userid\` ASC));
    `,
  gay: `CREATE TABLE if not exists \`is-gay\`.\`gay\` (
        \`user\` VARCHAR(255) NOT NULL,
        \`id\` VARCHAR(45) NOT NULL,
        \`by\` VARCHAR(255) NOT NULL,
        \`reason\` VARCHAR(255) NOT NULL DEFAULT 'They are gay',
        \`at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`id_UNIQUE\` (\`id\` ASC));
    `,
};

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

// let con = createConnection({
//   host: "localhost",
//   user: "root",
//   password: keys.mysqlPassWord,
// });


let type = GetType();

console.log("pre : " + type);

// var root = { hello: () => 'Hello world!' };

// let mw = ExGraphQL.graphqlHTTP(
//     {
//         pretty:true,
//         schema:{},
//         rootValue:root,
//         graphiql: true,

//     }
// )

// Routes

// app.use('/graphql',mw)
app.use("/api", APIRouter);
app.locals.CurrentContext = type
if (type) {
    app.all(/.*/, function(req, res, next) {
        // res.header("content-security-policy","style-src 'self' https://*.google.com 'unsafe-inline' https://stackpath.bootstrapcdn.com https://*.googleapis.com; script-src 'self' http://localhost https://*.pozm.pw https://cdnjs.cloudflare.com https://stackpath.bootstrapcdn.com https://code.jquery.com 'sha256-GQrFe/mgM9DWkplwjVc1jXMPlWiyZB8kB6oQVzuloI8=' https://*.cloudflare.com; font-src https://*; ")
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

app.listen(type ? 80 : 5000, () =>
  console.log(`server listening on port ${type ? 80 : 5000}`)
);

export { con, dataStructures };
