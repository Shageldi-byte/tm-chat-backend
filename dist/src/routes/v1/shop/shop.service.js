"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteShop = exports.findAllShops = exports.createShop = void 0;
const connection_1 = __importDefault(require("../../../database/connection"));
const app_response_1 = require("../../../core/app.response");
const utils_1 = require("../../../core/utils");
const query_1 = require("../../../database/query");
function createShop(req, res) {
    let { address, name, phone_number, slug } = req.body;
    if (!slug || typeof slug === 'undefined' || slug === '') {
        slug = (0, utils_1.generateUUID)();
    }
    connection_1.default.query(query_1.addStoreQuery, [
        name,
        address,
        phone_number,
        slug
    ]).then(response => {
        res.json((0, app_response_1.generateResponse)({
            body: response.rows[0]
        }));
    })
        .catch(err => {
        console.log(err);
        (0, app_response_1.badRequest)({ res });
    });
}
exports.createShop = createShop;
function findAllShops(req, res) {
    connection_1.default.query(query_1.findAllShopsQuery)
        .then(result => {
        res.json((0, app_response_1.generateResponse)({
            body: result.rows
        }));
    })
        .catch(err => {
        (0, app_response_1.badRequest)({ res });
    });
}
exports.findAllShops = findAllShops;
function deleteShop(req, res) {
    connection_1.default.query(query_1.deleteShopQuery, [req.params.id])
        .then(response => {
        res.json((0, app_response_1.generateResponse)({ body: 'success' }));
    }).catch(err => {
        (0, app_response_1.badRequest)({ res });
    });
}
exports.deleteShop = deleteShop;
