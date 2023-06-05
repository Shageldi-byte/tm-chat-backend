import connection from "../../../database/connection";
import fs from "fs";
import multer from "multer";
import { Request, Response } from "express";
import { badRequest, generateResponse } from "../../../core/app.response";
import { convertBase64, generateRandomAvatar, generateUUID } from "../../../core/utils";
import { addUserQuery, getModeratorsByShopQuery, getModeratorsQuery, updateUserAvatarQuery } from "../../../database/query";
import { CreateModeratorDto } from "./dto/create-modetor.dto";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/avatar/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

export const uploadAvatar = multer({ storage: storage })


export async function updateUserAvatar(req: Request, res: Response){
    try{
      const avatar = req.file?.path;
      const base64 = convertBase64(avatar?avatar:generateRandomAvatar(generateUUID()));
      const {user}: any = req;
      const user_id = user.id;
      if(avatar){
          fs.unlink(avatar, () => { });
      }
      connection.query(updateUserAvatarQuery,[base64, user_id])
      .then(response =>{
          if(response.rows.length>0){
              res.json(generateResponse({body: response.rows[0]}));
          } else {
              badRequest({res});
          }
      }).catch(err=>{
          badRequest({res});
      })
    } catch(err){
      console.error(err);
      badRequest({res});
    } 
}

export function getModeratorsByShop(req: Request, res: Response){
  const {
    shopuuid
  } = req.query;
  let query = getModeratorsQuery;
  let values = [];
  if(shopuuid){
    query = getModeratorsByShopQuery;
    values.push(shopuuid);
  }
  connection.query(query,values)
  .then(result=>{
    res.json(generateResponse({body: result.rows}));
  })
  .catch(err=>{
    badRequest({res});
  })
}

export function createModerator(req: Request<{},{},CreateModeratorDto>, res: Response){
    req.body.uuid = generateUUID();
     const {
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
    } = req.body;

    connection
      .query(addUserQuery, [
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
        } else {
          badRequest({
            res,
          });
        }
      })
      .catch((err) => {
        badRequest({
          res,
          message: err,
        });
      });
}

export async function deleteModerator(req: Request, res: Response){
  const user = await connection.query('SELECT usertype FROM users WHERE id = $1 AND is_deleted=false;',[req.params.id]);
  if(user && user.rows.length>0 && user.rows[0].usertype === 'MODERATOR'){
    await connection.query('UPDATE users SET is_deleted=true WHERE id = $1;',[req.params.id]);
    res.json(generateResponse({body: 'success'}));
  } else {
    badRequest({res});
  }
}