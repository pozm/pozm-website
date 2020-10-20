import { json, urlencoded } from "body-parser";
import { Connection, createConnection } from "mysql";
import { join } from "path";
// import ExGraphQL = require('express-graphql');
// import GraphQL = require('graphql');
import { promisify } from "util";
import { APIRouter } from "./api";
import { keys } from "./keys";
import express = require("express");
let app = express();
import multer = require("multer");
let upload = multer();
import session = require("express-session");
let MySQLStore = require("express-mysql-session")(session);

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

const db_config = {
    host: "localhost",
    user: "root",
    password: keys.mysqlPassWord,
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


let type = false;
if (process.argv[2] == "prod") {
  type = true;
}

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
if (type) {
  app.use(express.static(join(__dirname, "../../client/build")));
  app.get("/*", (req, res) => {
    res.sendFile(join(__dirname, "../../client/build/index.html"));
  });
}

app.listen(type ? 80 : 5000, () =>
  console.log(`server listening on port ${type ? 80 : 5000}`)
);

export { con, dataStructures };
