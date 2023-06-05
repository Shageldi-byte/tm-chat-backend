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
exports.getChatRoomDetails = exports.inviteChatRoom = exports.deleteChatByDate = exports.leaveChatRoom = exports.getChatHistory = exports.getChatRoomMessages = exports.markAsRead = exports.sendImageMessage = exports.uploadChatImage = exports.sendMessage = exports.initChat = void 0;
const send_message_dto_1 = __importDefault(require("./dto/send-message.dto"));
const connection_1 = __importDefault(require("../../../database/connection"));
const pg_format_1 = __importDefault(require("pg-format"));
const multer_1 = __importDefault(require("multer"));
const __1 = require("../../../..");
const app_response_1 = require("../../../core/app.response");
const constant_1 = require("../../../core/constant");
const utils_1 = require("../../../core/utils");
const utils_2 = require("../../../core/utils");
const query_1 = require("../../../database/query");
const query_2 = require("../../../database/query");
function initChat(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { description, email, firstname, front_id, image, lastname, password, phone_number, shop_slug, username, uuid, socket_id, } = req.body;
        let userId = -1;
        let toUsers = yield connection_1.default.query(query_1.getAdminUsers);
        if (shop_slug &&
            typeof shop_slug !== "undefined" &&
            shop_slug !== null &&
            shop_slug.length > 0) {
            toUsers = yield connection_1.default.query(query_1.getModeratorsByShopQuery, [shop_slug]);
        }
        if (!image ||
            typeof image === "undefined" ||
            image === null ||
            image === "") {
            image = (0, utils_2.generateRandomAvatar)(`${username} ${password}`);
        }
        let title = `${firstname} ${lastname}`;
        if (!title ||
            typeof title === "undefined" ||
            title == null ||
            title.length <= 0 ||
            typeof firstname === "undefined" ||
            typeof lastname === "undefined") {
            title = username;
        }
        if (uuid && typeof uuid !== "undefined" && uuid !== null && uuid.length > 0) {
            const oldData = yield connection_1.default.query(query_2.checkByUUID, [uuid]);
            if (oldData.rows.length > 0) {
                const userUpdated = yield connection_1.default.query(query_2.updateUserDataQuery, [
                    firstname,
                    lastname,
                    username,
                    password,
                    phone_number,
                    email,
                    image,
                    uuid,
                    description,
                    front_id,
                ]);
                if (userUpdated.rows.length <= 0) {
                    (0, app_response_1.badRequest)({ res });
                    return;
                }
                const user = userUpdated.rows[0];
                let roomUUID = socket_id;
                userId = user.id;
                yield connection_1.default.query(query_1.updateRoomUsedQuery, [userId]);
                toUsers.rows.push(user);
                let chatRoomCreated = null;
                let isUser = user.user_type === 'USER';
                if (user.user_type === 'USER') {
                    chatRoomCreated = yield connection_1.default.query(query_2.createChatRoomQuery, [
                        title,
                        image,
                        user.id,
                        shop_slug,
                        roomUUID,
                    ]);
                }
                if ((chatRoomCreated && chatRoomCreated.rows.length > 0) || !isUser) {
                    let sendMessage = { rows: [] };
                    let message = new send_message_dto_1.default();
                    message.chat_room_uuid = roomUUID;
                    message.click_url = "";
                    message.front_path = "";
                    message.message = `${title} joined chat`;
                    message.message_duration = "";
                    message.message_size = "0";
                    message.mime_type = "plaintext/*";
                    message.reply_id = 0;
                    message.status = "pending";
                    message.to_id = 0;
                    message.user_id = userId;
                    message.avatar = image;
                    message.username = title;
                    message.uuid = (0, utils_1.generateUUID)();
                    message.created_at = new Date();
                    message.users = [...toUsers.rows.map((row) => row.id), userId];
                    if (isUser) {
                        let cr = chatRoomCreated.rows[0];
                        cr.users = toUsers.rows;
                        __1.SocketIO.emit(constant_1.SOCKET_EVENTS.onChatRoomCreated, cr);
                    }
                    let oldRooms = [];
                    if (user.usertype === 'USER') {
                        oldRooms = yield connection_1.default.query(query_1.getUserChatRoomsQuery, [userId]);
                    }
                    else {
                        oldRooms = yield connection_1.default.query(query_1.getUserChatRoomsModeratorQuery, [userId]);
                    }
                    __1.SocketIO.emit(constant_1.SOCKET_EVENTS.onNewMessage, message);
                    if (toUsers.rows.length > 0) {
                        let values = [[userId, roomUUID]];
                        toUsers.rows.forEach((row) => values.push([row.id, roomUUID]));
                        yield connection_1.default.query((0, pg_format_1.default)(query_1.addUserToRoomQuery, values));
                    }
                    sendMessage = yield connection_1.default.query(query_2.addMessageQuery, [
                        userId,
                        "plaintext/*",
                        `Ulanyjy ${title} çata baglandy!`,
                        "",
                        0,
                        0,
                        "",
                        0,
                        0,
                        "pending",
                        (0, utils_1.generateUUID)(),
                        roomUUID,
                    ]);
                    res.json((0, app_response_1.generateResponse)({
                        body: {
                            user: user,
                            chatRoom: chatRoomCreated ? chatRoomCreated.rows[0] : {},
                            oldRooms: oldRooms.rows,
                            sendMessage: {
                                message: "Siz çata baglandyňyz!",
                            },
                        },
                    }));
                }
                else {
                    (0, app_response_1.badRequest)({
                        res,
                        message: {
                            en: "Chat room creation failed",
                            tm: "Chat otagyny döredip bolmady",
                        },
                    });
                }
            }
        }
        else {
            uuid = (0, utils_1.generateUUID)();
            const createdUser = yield connection_1.default.query(query_2.addUserQuery, [
                firstname,
                lastname,
                username,
                password,
                phone_number,
                email,
                image,
                uuid,
                "USER",
                description,
                front_id,
                null,
            ]);
            if (createdUser && createdUser.rows.length > 0) {
                const user = createdUser.rows[0];
                let roomUUID = socket_id;
                userId = user.id;
                toUsers.rows.push(user);
                const chatRoomCreated = yield connection_1.default.query(query_2.createChatRoomQuery, [
                    title,
                    image,
                    user.id,
                    shop_slug,
                    roomUUID,
                ]);
                if (chatRoomCreated && chatRoomCreated.rows.length > 0) {
                    let sendMessage = { rows: [] };
                    if (toUsers.rows.length > 0) {
                        let values = [[userId, roomUUID]];
                        toUsers.rows.forEach((row) => values.push([row.id, roomUUID]));
                        yield connection_1.default.query((0, pg_format_1.default)(query_1.addUserToRoomQuery, values));
                    }
                    let message = new send_message_dto_1.default();
                    message.chat_room_uuid = roomUUID;
                    message.click_url = "";
                    message.front_path = "";
                    message.message = `${title} joined chat`;
                    message.message_duration = "";
                    message.message_size = "0";
                    message.mime_type = "plaintext/*";
                    message.reply_id = 0;
                    message.status = "pending";
                    message.to_id = 0;
                    message.user_id = userId;
                    message.uuid = (0, utils_1.generateUUID)();
                    message.avatar = image;
                    message.username = title;
                    message.created_at = new Date();
                    message.users = [...toUsers.rows.map((row) => row.id), userId];
                    let cr = chatRoomCreated.rows[0];
                    cr.users = toUsers.rows;
                    const oldRooms = yield connection_1.default.query(query_1.getUserChatRoomsQuery, [userId]);
                    __1.SocketIO.emit(constant_1.SOCKET_EVENTS.onNewMessage, message);
                    __1.SocketIO.emit(constant_1.SOCKET_EVENTS.onChatRoomCreated, cr);
                    sendMessage = yield connection_1.default.query(query_2.addMessageQuery, [
                        userId,
                        "plaintext/*",
                        `Ulanyjy ${title} çata baglandy!`,
                        "",
                        0,
                        0,
                        "",
                        0,
                        0,
                        "pending",
                        (0, utils_1.generateUUID)(),
                        roomUUID,
                    ]);
                    res.json((0, app_response_1.generateResponse)({
                        body: {
                            user: user,
                            chatRoom: chatRoomCreated.rows[0],
                            oldRooms: oldRooms.rows,
                            sendMessage: {
                                message: "Siz çata baglandyňyz!",
                            },
                        },
                    }));
                }
                else {
                    (0, app_response_1.badRequest)({
                        res,
                        message: {
                            en: "Chat room creation failed",
                            tm: "Chat otagyny döredip bolmady",
                        },
                    });
                }
            }
            else {
                (0, app_response_1.badRequest)({
                    res: res,
                    message: {
                        en: "User could not be created",
                        tm: "Ulanyjyny doredip bolmady",
                    },
                    code: 400,
                });
            }
        }
    });
}
exports.initChat = initChat;
function sendMessage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { message, mime_type, user_id, front_path, to_id, reply_id, click_url, message_size, message_duration, status, chat_room_uuid, username, avatar, } = req.body;
            console.log('room', chat_room_uuid);
            let uuid = (0, utils_1.generateUUID)();
            req.body.uuid = uuid;
            req.body.created_at = new Date();
            let users = yield connection_1.default.query(query_1.getChatRoomUsersQuery, [chat_room_uuid]);
            let sendMessage = yield connection_1.default.query(query_2.addMessageQuery, [
                user_id, mime_type, message, front_path, to_id, reply_id, click_url, message_size, message_duration, status, uuid, chat_room_uuid
            ]);
            req.body.users = users.rows.map((user) => user.user_id);
            __1.SocketIO.emit(constant_1.SOCKET_EVENTS.onNewMessage, req.body);
            res.json((0, app_response_1.generateResponse)({
                body: sendMessage.rows[0],
            }));
        }
        catch (err) {
            throw err;
        }
    });
}
exports.sendMessage = sendMessage;
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/upload");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
    },
});
exports.uploadChatImage = (0, multer_1.default)({ storage: storage });
function sendImageMessage(req, res) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        let image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        console.log(image);
        const { user_id, front_path, to_id, reply_id, status, chat_room_uuid, username, avatar, } = req.body;
        let uuid = (0, utils_1.generateUUID)();
        req.body.message = `${image}`;
        req.body.click_url = `${image}`;
        req.body.message_size = `${(_b = req.file) === null || _b === void 0 ? void 0 : _b.size}`;
        req.body.uuid = uuid;
        req.body.created_at = new Date();
        console.log(chat_room_uuid);
        let users = yield connection_1.default.query(query_1.getChatRoomUsersQuery, [chat_room_uuid]);
        let sendMessage = yield connection_1.default.query(query_2.addMessageQuery, [
            user_id,
            "image/*",
            image,
            front_path,
            to_id,
            0,
            image,
            (_c = req.file) === null || _c === void 0 ? void 0 : _c.size,
            0,
            "sent",
            uuid,
            chat_room_uuid,
        ]);
        req.body.users = users.rows.map((user) => user.user_id);
        __1.SocketIO.emit(constant_1.SOCKET_EVENTS.onNewMessage, req.body);
        res.json((0, app_response_1.generateResponse)({
            body: sendMessage.rows[0],
        }));
    });
}
exports.sendImageMessage = sendImageMessage;
function markAsRead(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { roomId, userId } = req.body;
        const updated = yield connection_1.default.query(query_1.markAsReadQuery, [roomId, userId]);
        let data = {
            ids: updated.rows,
            roomId,
            userId,
        };
        res.json((0, app_response_1.generateResponse)({
            body: data,
        }));
        __1.SocketIO.emit(constant_1.SOCKET_EVENTS.onMarkAsRead, data);
    });
}
exports.markAsRead = markAsRead;
function getChatRoomMessages(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const chatRoomUUID = req.params.chatRoom;
            connection_1.default.query(query_1.getOldMessagesQuery, [chatRoomUUID])
                .then(result => {
                res.json((0, app_response_1.generateResponse)({
                    body: result.rows
                }));
            })
                .catch(err => {
                throw err;
            });
        }
        catch (err) {
            throw err;
        }
    });
}
exports.getChatRoomMessages = getChatRoomMessages;
function getChatHistory(req, res) {
    return __awaiter(this, void 0, void 0, function* () { });
}
exports.getChatHistory = getChatHistory;
function leaveChatRoom(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.params.userId;
        const roomId = req.params.roomId;
        yield connection_1.default.query(query_1.leaveChatRoomQuery, [roomId, userId])
            .then(result => {
            __1.SocketIO.emit(constant_1.SOCKET_EVENTS.onUserLeaveChatRoom, { roomId, userId });
            res.json((0, app_response_1.generateResponse)({ body: { userId, roomId } }));
        })
            .catch(err => {
            (0, app_response_1.badRequest)({ res });
        });
    });
}
exports.leaveChatRoom = leaveChatRoom;
function deleteChatByDate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { start_date, end_date } = req.body;
        try {
            yield connection_1.default.query(query_1.removeChatRoomQuery, [start_date, end_date]);
            yield connection_1.default.query(query_1.removeChatHistoryQuery, [start_date, end_date])
                .then(response => {
                res.json((0, app_response_1.generateResponse)({ body: 'success' }));
            })
                .catch(err => {
                (0, app_response_1.badRequest)({ res });
            });
        }
        catch (err) {
            (0, app_response_1.badRequest)({ res });
        }
    });
}
exports.deleteChatByDate = deleteChatByDate;
function inviteChatRoom(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { roomUUID, userId } = req.body;
        try {
            connection_1.default.query(query_1.addSingleUserToRoomQuery, [userId, roomUUID])
                .then(result => {
                if (result.rows.length > 0) {
                    res.json((0, app_response_1.generateResponse)({ body: result.rows[0] }));
                    __1.SocketIO.emit(constant_1.SOCKET_EVENTS.onInviteChatRoom, { roomUUID, userId });
                }
                else {
                    console.log('1');
                    (0, app_response_1.badRequest)({ res });
                }
            })
                .catch(err => {
                console.log(err);
                (0, app_response_1.badRequest)({ res });
            });
        }
        catch (err) {
            (0, app_response_1.badRequest)({ res });
        }
    });
}
exports.inviteChatRoom = inviteChatRoom;
function getChatRoomDetails(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const roomId = req.params.roomId;
        connection_1.default.query(query_1.getChatRoomDetailsQuery, [roomId])
            .then(result => {
            res.json(result.rows[0]);
        })
            .catch(err => {
            (0, app_response_1.badRequest)({ res });
        });
    });
}
exports.getChatRoomDetails = getChatRoomDetails;
