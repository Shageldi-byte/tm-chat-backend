import connection from "../../../database/connection";
import { NextFunction, Request, Response } from "express";
import { addLogQuery } from "../../../database/query";
import { AddLogDto } from "./dto/add-log.dto";

export function addLog(log: AddLogDto){
    const {
        user_id, endpoint, full_url, req_params, req_query, req_headers, req_body, req_ip, req_files
    } = log;
    return new Promise((resolve, reject) =>{
        connection.query(addLogQuery,[
            user_id, endpoint, full_url, req_params, req_query, req_headers, req_body, req_ip, req_files
        ]).then(result=>{
            if(result.rows.length>0){
                resolve(result.rows[0]);
            } else {
                reject('Could not insert log')
            }
        })
        .catch(err=>{
            reject('Could not add log');
        })
    })
}

export async function addLogMiddleware(req: Request, res: Response, next: NextFunction){
    const {user} : any = req;
    const log = new AddLogDto();
    log.user_id = user.id?Number(user.id):0;
    log.full_url = req.originalUrl;
    log.endpoint = req.url;
    log.req_body = JSON.stringify(req.body);
    log.req_files = req.files?JSON.stringify(req.files):JSON.stringify(req.file);
    log.req_headers = JSON.stringify(req.headers);
    log.req_ip = req.ip;
    log.req_params = JSON.stringify(req.params);
    log.req_query = JSON.stringify(req.query);
    await addLog(log);
    next();
}