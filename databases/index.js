"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseType = exports.postgresManager = exports.mysqlManager = exports.mongoManager = void 0;
var mongo_1 = require("./mongo");
Object.defineProperty(exports, "mongoManager", { enumerable: true, get: function () { return mongo_1.mongoManager; } });
var mysql_1 = require("./mysql");
Object.defineProperty(exports, "mysqlManager", { enumerable: true, get: function () { return mysql_1.mysqlManager; } });
var postgres_1 = require("./postgres");
Object.defineProperty(exports, "postgresManager", { enumerable: true, get: function () { return postgres_1.postgresManager; } });
var DatabaseType;
(function (DatabaseType) {
    DatabaseType["mongo"] = "mongo";
    DatabaseType["mysql"] = "mysql";
    DatabaseType["postgres"] = "postgres";
})(DatabaseType || (exports.DatabaseType = DatabaseType = {}));
