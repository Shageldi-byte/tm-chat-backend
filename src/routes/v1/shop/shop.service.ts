import ShopDto from "./dto/shop.dto";
import connection from "../../../database/connection";
import { Request, Response } from "express";
import { badRequest, generateResponse } from "../../../core/app.response";
import { generateUUID } from "../../../core/utils";
import { addStoreQuery, deleteShopQuery, findAllShopsQuery } from "../../../database/query";

export function createShop(req: Request<{},{},ShopDto>, res: Response){
    let {
        address,
        name,
        phone_number,
        slug
    } = req.body;
    if(!slug || typeof slug === 'undefined' || slug === ''){
        slug = generateUUID();
    }
    connection.query(addStoreQuery,[
        name, 
        address, 
        phone_number, 
        slug
    ]).then(response => {
        res.json(generateResponse({
            body: response.rows[0]
        }))
    })
    .catch(err => {
        console.log(err);
        badRequest({res});
    });
}

export function findAllShops(req: Request, res: Response){
    connection.query(findAllShopsQuery)
    .then(result=>{
        res.json(generateResponse({
            body: result.rows
        }));
    })
    .catch(err=>{
        badRequest({res});
    })
}

export function deleteShop(req: Request, res: Response){
    connection.query(deleteShopQuery,[req.params.id])
    .then(response=>{
        res.json(generateResponse({body:'success'}))
    }).catch(err=>{
        badRequest({res});
    })
}