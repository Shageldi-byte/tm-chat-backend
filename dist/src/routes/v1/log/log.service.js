"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLogMiddleware = exports.addLog = void 0;
const connection_1 = __importDefault(require("../../../database/connection"));
const query_1 = require("../../../database/query");
const add_log_dto_1 = require("./dto/add-log.dto");
function addLog(log) {
    const { user_id, endpoint, full_url, req_params, req_query, req_headers, req_body, req_ip, req_files } = log;
    return new Promise((resolve, reject) => {
        connection_1.default.query(query_1.addLogQuery, [
            user_id, endpoint, full_url, req_params, req_query, req_headers, req_body, req_ip, req_files
        ]).then(result => {
            if (result.rows.length > 0) {
                resolve(result.rows[0]);
            }
            else {
                reject('Could not insert log');
            }
        })
            .catch(err => {
            reject('Could not add log');
        });
    });
}
exports.addLog = addLog;
function addLogMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user } = req;
        const log = new add_log_dto_1.AddLogDto();
        log.user_id = user.id ? Number(user.id) : 0;
        log.full_url = req.originalUrl;
        log.endpoint = req.url;
        log.req_body = JSON.stringify(req.body);
        log.req_files = req.files ? JSON.stringify(req.files) : JSON.stringify(req.file);
        log.req_headers = JSON.stringify(req.headers);
        log.req_ip = req.ip;
        log.req_params = JSON.stringify(req.params);
        log.req_query = JSON.stringify(req.query);
        yield addLog(log);
        next();
    });
}
exports.addLogMiddleware = addLogMiddleware;
