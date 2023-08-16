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
var mysql2_1 = require("mysql2");
var connectionsMap = new Map();
var getDefaultConnectionDetails = function (details) { return (__assign({ host: '127.0.0.1', user: 'root', password: process.env.MYSQL_PASSWORD, port: 3306 }, details)); };
var connect = function (connectionDetails) {
    connectionDetails = getDefaultConnectionDetails(connectionDetails);
    var connectionKey = JSON.stringify(connectionDetails);
    if (connectionsMap.has(connectionKey)) {
        console.log('Connection already exists!');
        return connectionsMap.get(connectionKey);
    }
    // Replace the connection settings with your MySQL configuration
    var connection = mysql2_1.default.createConnection({
        host: connectionDetails.host,
        user: connectionDetails.user,
        password: connectionDetails.password,
        port: connectionDetails.port,
    });
    connection.on('end', function () {
        console.log('Connection ended!');
        connectionsMap.delete(connectionKey);
    });
    return new Promise(function (resolve, reject) {
        // Connect to MySQL
        connection.connect(function (err) {
            if (err)
                reject(err);
            else {
                console.log('Connected to MySQL server!');
                connectionsMap.set(connectionKey, connection);
                resolve(connection);
            }
        });
    });
};
exports.connect = connect;
