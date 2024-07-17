import express from "express";
import { makeValidateBody } from "../../../validation";
import { checkUsername, hashPassword } from "../auth/auth.service";
import { authenticateToken, checkIsAdmin } from "../auth/jwt.service";
import { addLogMiddleware } from "../log/log.service";
import { CreateModeratorDto } from "./dto/create-modetor.dto";
import { createModerator, deleteModerator, getModeratorsByShop, updateUserAvatar, uploadAvatar } from "./user.service";

const userController = express.Router();

userController.patch('/update-user-avatar',authenticateToken,uploadAvatar.single('image'),addLogMiddleware,updateUserAvatar);
userController.get('/get-moderators-by-shop-uuid',authenticateToken,checkIsAdmin,getModeratorsByShop)
userController.post('/create-moderator',authenticateToken,checkIsAdmin,makeValidateBody(CreateModeratorDto,false),checkUsername(true),hashPassword,createModerator);
userController.delete('/delete-moderator/:id',authenticateToken,checkIsAdmin,deleteModerator)
export default userController;