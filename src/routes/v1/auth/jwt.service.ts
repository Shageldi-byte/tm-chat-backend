import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { badRequest } from "../../../core/app.response";
import { SECRET_KEY } from "../../../core/constant";
import { UserType } from "./dto/signup.dto";

export interface AuthenticatedRequest extends Request {
  user: any;
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        
        (req as AuthenticatedRequest).user = user;

        next()
    })
}

export function authenticateTokenOptional(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        // req.isLogin = false;
        next()
    } else {
        jwt.verify(token, SECRET_KEY, (err, user) => {

            if (err) {
                // req.isLogin = false;
            } else {
                // req.user = user;
                // req.isLogin = true;
            }


            next()
        })
    }


}

export function checkIsAdmin(req: Request,  res: Response, next: NextFunction){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403)
        const { usertype }: any = user;
        if(usertype == 'ADMIN'){
            (req as AuthenticatedRequest).user = user;
            next()
        } else {
            badRequest({
                res,
                code: 403,
                message: {
                    tm: 'Bu herekedi etmek üçin size rugsat berilmedik',
                    en: 'You are not allowed to access this event'
                }
            })
        }
    })
}

