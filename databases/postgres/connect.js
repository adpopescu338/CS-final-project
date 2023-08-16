"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
var pg_1 = require("pg");
var getDefaultConnectionDetails = function (details) { return (__assign({ host: process.env.POSTGRES_HOST, user: process.env.POSTGRES_USER, password: process.env.POSTGRES_PASSWORD, port: 5432 }, details)); };
var connectionsMap = new Map();
var connect = function (connectionDetails) {
    connectionDetails = getDefaultConnectionDetails(connectionDetails);
    var connectionKey = JSON.stringify(connectionDetails);
    if (connectionsMap.has(connectionKey)) {
        console.log('Connection already exists!');
        return connectionsMap.get(connectionKey);
    }
    var client = new pg_1.default.Client(connectionDetails);
    // This will replace the 'end' event listener for the MySQL connection
    client.on('end', function () {
        console.log('Connection ended!');
        connectionsMap.delete(connectionKey);
    });
    return new Promise(function (resolve, reject) {
        // Connect to PostgreSQL
        client.connect(function (err) {
            if (err)
                reject(err);
            else {
                console.log('Connected to PostgreSQL server!');
                connectionsMap.set(connectionKey, client);
                resolve(client);
            }
        });
    });
};
exports.connect = connect;
