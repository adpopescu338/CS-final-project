"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDatabase = void 0;
var deleteDatabase = function (client, database) {
    return new Promise(function (resolve, reject) {
        client.query("DROP DATABASE ".concat(database), function (err, result) {
            if (err)
                reject(err);
            else {
                console.log('Database deleted!', result);
                resolve();
            }
        });
    });
};
exports.deleteDatabase = deleteDatabase;
