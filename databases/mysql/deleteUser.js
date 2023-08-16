"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = void 0;
var deleteUser = function (connection, username) {
    return new Promise(function (resolve, reject) {
        connection.query("DROP USER '".concat(username, "'@'%'"), function (err, result) {
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
