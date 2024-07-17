"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MimeType = exports.MessageStatus = void 0;
var MessageStatus;
(function (MessageStatus) {
    MessageStatus[MessageStatus["pending"] = 0] = "pending";
    MessageStatus[MessageStatus["sent"] = 1] = "sent";
    MessageStatus[MessageStatus["received"] = 2] = "received";
    MessageStatus[MessageStatus["seen"] = 3] = "seen";
    MessageStatus[MessageStatus["deleted_for_me"] = 4] = "deleted_for_me";
    MessageStatus[MessageStatus["deleted_for_all"] = 5] = "deleted_for_all";
})(MessageStatus = exports.MessageStatus || (exports.MessageStatus = {}));
var MimeType;
(function (MimeType) {
    MimeType[MimeType["plaintext/*"] = 0] = "plaintext/*";
    MimeType[MimeType["image/*"] = 1] = "image/*";
    MimeType[MimeType["video/*"] = 2] = "video/*";
    MimeType[MimeType["audio/*"] = 3] = "audio/*";
    MimeType[MimeType["pdf/*"] = 4] = "pdf/*";
    MimeType[MimeType["docx/*"] = 5] = "docx/*";
    MimeType[MimeType["emoji/*"] = 6] = "emoji/*";
    MimeType[MimeType["url/*"] = 7] = "url/*";
    MimeType[MimeType["phone/*"] = 8] = "phone/*";
    MimeType[MimeType["ppt/*"] = 9] = "ppt/*";
    MimeType[MimeType["excell/*"] = 10] = "excell/*";
    MimeType[MimeType["document/*"] = 11] = "document/*";
    MimeType[MimeType["aplication/*"] = 12] = "aplication/*";
    MimeType[MimeType["archive/*"] = 13] = "archive/*";
    MimeType[MimeType["other"] = 14] = "other";
    MimeType[MimeType["lottie/*"] = 15] = "lottie/*";
})(MimeType = exports.MimeType || (exports.MimeType = {}));
