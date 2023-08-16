"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = void 0;
var deleteUser = function (client, username) {
    return new Promise(function (resolve, reject) {
        client.query("DROP USER ".concat(username), function (err, result) {
            if (err)
                reject(err);
            else {
                console.log('User deleted!', result);
                resolve();
            }
        });
    });
};
exports.deleteUser = deleteUser;
