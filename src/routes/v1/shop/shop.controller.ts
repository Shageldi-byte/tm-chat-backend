import ShopDto from "./dto/shop.dto";
import express, { Router } from "express";
import { makeValidateBody } from "../../../validation";
import { authenticateToken } from "../auth/jwt.service";
import { checkIsAdmin } from "../auth/jwt.service";
import { addLogMiddleware } from "../log/log.service";
import { createShop, deleteShop, findAllShops } from "./shop.service";

const shopController: Router = express.Router();

shopController.post('/add-shop', authenticateToken, checkIsAdmin,makeValidateBody(ShopDto),addLogMiddleware, createShop);
shopController.get('/find-all-shops', authenticateToken, checkIsAdmin, findAllShops);
shopController.delete('/delete-shop/:id',authenticateToken, checkIsAdmin, deleteShop);

export default shopController;
