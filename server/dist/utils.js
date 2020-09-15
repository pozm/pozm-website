"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataFromId = exports.AsyncQuery = exports.getIdFromUser = void 0;
const _1 = require(".");
async function getIdFromUser(user) {
    return new Promise(res => {
        _1.con.query('select id from `whitelist`.`account` where Username = ?', user, (err, res2) => {
            if (err)
                throw err;
            if (0 in res2)
                return res(res2[0].ID);
            res(false);
        });
    });
}
exports.getIdFromUser = getIdFromUser;
async function getDataFromId(id) {
    if (!id)
        return null;
    return new Promise(res => {
        _1.con.query('select *, NULL AS password from `whitelist`.`account` where ID = ?', id, (err, res2) => {
            if (err)
                throw err;
            if (0 in res2) {
                return res(res2[0]);
            }
            res(null);
        });
    });
}
exports.getDataFromId = getDataFromId;
async function AsyncQuery(query, args) {
    return new Promise(resolve => {
        let func = (err, result) => {
            if (err)
                throw err;
            return resolve(result);
        };
        _1.con.query(query, args ?? func, func);
    });
}
exports.AsyncQuery = AsyncQuery;
