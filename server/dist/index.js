"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncQuery = exports.dataStructures = exports.con = void 0;
const body_parser_1 = require("body-parser");
const mysql_1 = require("mysql");
const path_1 = require("path");
// import ExGraphQL = require('express-graphql');
// import GraphQL = require('graphql');
const util_1 = require("util");
const api_1 = require("./api");
const keys_1 = require("./keys");
const express = require("express");
let app = express();
const multer = require("multer");
let upload = multer();
const session = require("express-session");
let MySQLStore = require("express-mysql-session")(session);
app.use(body_parser_1.json({ limit: "10kb", type: "*/*" }));
app.use(body_parser_1.urlencoded({ extended: false, limit: "10kb", parameterLimit: 100 }));
app.use(upload.array("/uploads"));
app.set("trust proxy", true);
var sessionStore = new MySQLStore({
    host: "localhost",
    port: 3306,
    user: "root",
    password: keys_1.keys.mysqlPassWord,
    database: "sessions",
});
app.use(session({
    store: sessionStore,
    secret: keys_1.keys.SessionKey,
    resave: true,
    saveUninitialized: false,
    cookie: {
        secure: "auto",
        expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30000),
        path: "/",
    },
    name: "session",
}));
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
exports.dataStructures = dataStructures;
const con = mysql_1.createConnection({
    host: "localhost",
    user: "root",
    password: keys_1.keys.mysqlPassWord,
});
exports.con = con;
let type = false;
if (process.argv[2] == "prod") {
    type = true;
}
console.log("pre : " + type);
let asyncQuery = util_1.promisify(con.query);
exports.asyncQuery = asyncQuery;
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
app.use("/api", api_1.APIRouter);
if (type) {
    app.use(express.static(path_1.join(__dirname, "../../client/build")));
    app.get("/*", (req, res) => {
        res.sendFile(path_1.join(__dirname, "../../client/build/index.html"));
    });
}
app.listen(type ? 80 : 5000, () => console.log(`server listening on port ${type ? 80 : 5000}`));
