"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = __importDefault(require("pg"));
const Pool = pg_1.default.Pool;
const connection = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'tm_chat',
    password: 'QwertyWeb123',
    port: 5432,
});
exports.default = connection;
