"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentDate = exports.generateRandomAvatar = exports.generateUUID = exports.convertBase64 = void 0;
const fs_1 = __importDefault(require("fs"));
const generate_avatar_1 = require("generate-avatar");
const uuid_1 = require("uuid");
const convertBase64 = (path) => {
    // read binary data from file
    const bitmap = fs_1.default.readFileSync(path);
    // convert the binary data to base64 encoded string
    return bitmap.toString('base64');
};
exports.convertBase64 = convertBase64;
function generateUUID() {
    return (0, uuid_1.v4)();
}
exports.generateUUID = generateUUID;
function generateRandomAvatar(str) {
    return (0, generate_avatar_1.generateFromString)(str);
}
exports.generateRandomAvatar = generateRandomAvatar;
function getCurrentDate() {
    let date = new Date();
    let m = date.getMonth() + 1;
    let str = `${date.getFullYear()}-${m}-${date.getDate()}`;
    return new Date(str);
}
exports.getCurrentDate = getCurrentDate;
