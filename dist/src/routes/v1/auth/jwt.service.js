"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsAdmin = exports.authenticateTokenOptional = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_response_1 = require("../../../core/app.response");
const constant_1 = require("../../../core/constant");
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, constant_1.SECRET_KEY, (err, user) => {
        if (err)
            return res.sendStatus(403);
        req.user = user;
        next();
    });
}
exports.authenticateToken = authenticateToken;
function authenticateTokenOptional(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        // req.isLogin = false;
        next();
    }
    else {
        jsonwebtoken_1.default.verify(token, constant_1.SECRET_KEY, (err, user) => {
            if (err) {
                // req.isLogin = false;
            }
            else {
                // req.user = user;
                // req.isLogin = true;
            }
            next();
        });
    }
}
exports.authenticateTokenOptional = authenticateTokenOptional;
function checkIsAdmin(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, constant_1.SECRET_KEY, (err, user) => {
        if (err)
            return res.sendStatus(403);
        const { usertype } = user;
        if (usertype == 'ADMIN') {
            req.user = user;
            next();
        }
        else {
            (0, app_response_1.badRequest)({
                res,
                code: 403,
                message: {
                    tm: 'Bu herekedi etmek üçin size rugsat berilmedik',
                    en: 'You are not allowed to access this event'
                }
            });
        }
    });
}
exports.checkIsAdmin = checkIsAdmin;
