"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDatabase = void 0;
var deleteDatabase = function (connection, database) {
    return new Promise(function (resolve, reject) {
        connection.query("DROP DATABASE ".concat(database), function (err, result) {
            if (err)
                reject(err);
            console.log('Database deleted!', result);
            resolve();
        });
    });
};
exports.deleteDatabase = deleteDatabase;
