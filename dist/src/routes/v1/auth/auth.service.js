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
exports.signIn = exports.checkPhoneNumber = exports.checkUsername = exports.hashPassword = exports.signUp = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const connection_1 = __importDefault(require("../../../database/connection"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_response_1 = require("../../../core/app.response");
const constant_1 = require("../../../core/constant");
const utils_1 = require("../../../core/utils");
const query_1 = require("../../../database/query");
const app_response_2 = require("./../../../core/app.response");
const saltRounds = 10;
function signUp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.uuid && req.body.uuid !== '') {
            const { firstname, lastname, username, password, phone_number, email, uuid, description, front_id, sell_point_uuid, } = req.body;
            yield connection_1.default.query(query_1.updateUserQuery, [
                firstname,
                lastname,
                username,
                password,
                phone_number,
                email,
                description,
                sell_point_uuid,
                front_id,
                uuid,
            ]).then(response => {
                if (response.rows.length > 0) {
                    let data = response.rows[0];
                    data.password = '';
                    let token = jsonwebtoken_1.default.sign(response.rows[0], constant_1.SECRET_KEY);
                    data.token = token;
                    res.json((0, app_response_2.generateResponse)({
                        body: data
                    }));
                }
                else {
                    (0, app_response_1.badRequest)({ res });
                }
            }).catch(err => {
                console.log(err);
                (0, app_response_1.badRequest)({ res });
            });
        }
        else {
            req.body.uuid = (0, utils_1.generateUUID)();
            const { firstname, lastname, username, password, phone_number, email, image, uuid, usertype, description, front_id, sell_point_uuid, } = req.body;
            connection_1.default
                .query(query_1.addUserQuery, [
                firstname,
                lastname,
                username,
                password,
                phone_number,
                email,
                image,
                uuid,
                usertype,
                description,
                front_id,
                sell_point_uuid,
            ])
                .then((response) => {
                if (response.rows.length) {
                    let data = response.rows[0];
                    data.password = '';
                    let token = jsonwebtoken_1.default.sign(response.rows[0], constant_1.SECRET_KEY);
                    data.token = token;
                    res.json({
                        error: false,
                        message: "Success",
                        body: data,
                    });
                }
                else {
                    (0, app_response_1.badRequest)({
                        res,
                    });
                }
            })
                .catch((err) => {
                (0, app_response_1.badRequest)({
                    res,
                    message: err,
                });
            });
        }
    });
}
exports.signUp = signUp;
function hashPassword(req, res, next) {
    bcrypt_1.default.genSalt(saltRounds, function (err, salt) {
        bcrypt_1.default.hash(req.body.password, salt, function (err, hash) {
            req.body.password = hash;
            next();
        });
    });
}
exports.hashPassword = hashPassword;
function checkUsername(isMiddleWare = false) {
    return function checker(req, res, next) {
        connection_1.default
            .query(query_1.checkUsernameQuery, [req.body.username])
            .then((result) => {
            if (result.rows.length > 0) {
                (0, app_response_1.badRequest)({
                    res: res,
                    code: 400,
                    message: {
                        tm: "Bu ulanyjy ady eýýäm bar",
                        en: "This username is already in use",
                    },
                });
            }
            else {
                if (isMiddleWare) {
                    next();
                }
                else {
                    res.json({
                        error: false,
                        message: {
                            tm: "Ulanyjy adyny ulanmak mümkin",
                            en: "This username is free",
                        },
                    });
                }
            }
        })
            .catch((err) => {
            (0, app_response_1.badRequest)({
                res: res,
                code: 400,
                message: {
                    tm: "Bu ulanyjy ady eýýäm bar",
                    en: "This username is already in use",
                },
            });
        });
    };
}
exports.checkUsername = checkUsername;
function checkPhoneNumber(isMiddleWare = false) {
    return function checker(req, res, next) {
        if (isMiddleWare && req.body.phone_number === "") {
            next();
        }
        else {
            connection_1.default
                .query(query_1.checkPhoneNumberQuery, [req.body.phone_number])
                .then((result) => {
                if (result.rows.length > 0) {
                    (0, app_response_1.badRequest)({
                        res: res,
                        code: 400,
                        message: {
                            tm: "Bu telefon belgi eýýäm bar",
                            en: "This phone number is already in use",
                        },
                    });
                }
                else {
                    if (isMiddleWare) {
                        next();
                    }
                    else {
                        res.json({
                            error: false,
                            message: {
                                tm: "Telefon belgisini ulanmak mümkin",
                                en: "This phone number is free",
                            },
                        });
                    }
                }
            })
                .catch((err) => {
                (0, app_response_1.badRequest)({
                    res: res,
                    code: 400,
                    message: {
                        tm: "Bu telefon belgi eýýäm bar",
                        en: "This phone number is already in use",
                    },
                });
            });
        }
    };
}
exports.checkPhoneNumber = checkPhoneNumber;
function signIn(req, res) {
    const body = req.body;
    connection_1.default
        .query(query_1.checkUsernameQuery, [body.username])
        .then((result) => {
        if (result.rows.length > 0) {
            let user = result.rows[0];
            if (bcrypt_1.default.compareSync(body.password, user.password)) {
                user.password = body.password;
                let token = jsonwebtoken_1.default.sign(user, constant_1.SECRET_KEY);
                user.token = token;
                res.json((0, app_response_2.generateResponse)({
                    body: user,
                }));
            }
            else {
                (0, app_response_1.badRequest)({
                    res,
                    code: 403,
                    message: {
                        tm: "Nädogry açar sözi",
                        en: "Invalid password",
                    },
                });
            }
        }
        else {
            (0, app_response_1.badRequest)({
                res,
                code: 403,
                message: {
                    tm: "Ulanyjy adyňyz nädogry",
                    en: "Invalid username",
                },
            });
        }
    })
        .catch((err) => {
        (0, app_response_1.badRequest)({
            res: res,
            code: 500,
            message: {
                tm: err,
                en: err,
            },
        });
    });
}
exports.signIn = signIn;
