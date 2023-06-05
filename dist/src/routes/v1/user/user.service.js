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
exports.deleteModerator = exports.createModerator = exports.getModeratorsByShop = exports.updateUserAvatar = exports.uploadAvatar = void 0;
const connection_1 = __importDefault(require("../../../database/connection"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const app_response_1 = require("../../../core/app.response");
const utils_1 = require("../../../core/utils");
const query_1 = require("../../../database/query");
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/avatar/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + file.originalname;
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});
exports.uploadAvatar = (0, multer_1.default)({ storage: storage });
function updateUserAvatar(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const avatar = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
            const base64 = (0, utils_1.convertBase64)(avatar ? avatar : (0, utils_1.generateRandomAvatar)((0, utils_1.generateUUID)()));
            const { user } = req;
            const user_id = user.id;
            if (avatar) {
                fs_1.default.unlink(avatar, () => { });
            }
            connection_1.default.query(query_1.updateUserAvatarQuery, [base64, user_id])
                .then(response => {
                if (response.rows.length > 0) {
                    res.json((0, app_response_1.generateResponse)({ body: response.rows[0] }));
                }
                else {
                    (0, app_response_1.badRequest)({ res });
                }
            }).catch(err => {
                (0, app_response_1.badRequest)({ res });
            });
        }
        catch (err) {
            console.error(err);
            (0, app_response_1.badRequest)({ res });
        }
    });
}
exports.updateUserAvatar = updateUserAvatar;
function getModeratorsByShop(req, res) {
    const { shopuuid } = req.query;
    let query = query_1.getModeratorsQuery;
    let values = [];
    if (shopuuid) {
        query = query_1.getModeratorsByShopQuery;
        values.push(shopuuid);
    }
    connection_1.default.query(query, values)
        .then(result => {
        res.json((0, app_response_1.generateResponse)({ body: result.rows }));
    })
        .catch(err => {
        (0, app_response_1.badRequest)({ res });
    });
}
exports.getModeratorsByShop = getModeratorsByShop;
function createModerator(req, res) {
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
exports.createModerator = createModerator;
function deleteModerator(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield connection_1.default.query('SELECT usertype FROM users WHERE id = $1 AND is_deleted=false;', [req.params.id]);
        if (user && user.rows.length > 0 && user.rows[0].usertype === 'MODERATOR') {
            yield connection_1.default.query('UPDATE users SET is_deleted=true WHERE id = $1;', [req.params.id]);
            res.json((0, app_response_1.generateResponse)({ body: 'success' }));
        }
        else {
            (0, app_response_1.badRequest)({ res });
        }
    });
}
exports.deleteModerator = deleteModerator;
