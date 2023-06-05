import connection from "../../../database/connection";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { badRequest } from "../../../core/app.response";
import { SECRET_KEY } from "../../../core/constant";
import { generateUUID } from "../../../core/utils";
import { addUserQuery, checkPhoneNumberQuery, checkUsernameQuery, updateUserQuery } from "../../../database/query";
import { generateResponse } from "./../../../core/app.response";
import { SignInDto } from "./dto/sign-in.dto";
import { SignupDto } from "./dto/signup.dto";

const saltRounds = 10;

export async function signUp(req: Request<{}, {}, SignupDto>, res: Response) {
  if (req.body.uuid && req.body.uuid!=='') {
    const {
      firstname,
      lastname,
      username,
      password,
      phone_number,
      email,
      uuid,
      description,
      front_id,
      sell_point_uuid,
    } = req.body;
    await connection.query(updateUserQuery,[
        firstname,
        lastname,
        username,
        password,
        phone_number,
        email,
        description,
        sell_point_uuid,
        front_id,
        uuid,
    ]).then(response => {
        if(response.rows.length>0){
            let data = response.rows[0];
            data.password = '';
            let token = jwt.sign(response.rows[0],SECRET_KEY);
            data.token= token;
            res.json(generateResponse({
                body: data
            }))
        } else {
            badRequest({res});
        }
    }).catch(err=>{
        console.log(err);
        badRequest({res});
    })
  } else {
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
          let token = jwt.sign(response.rows[0],SECRET_KEY);
          data.token= token;
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
}

export function hashPassword(req: Request, res: Response, next: NextFunction) {
  next();
}


export function checkUsername(isMiddleWare: boolean = false) {
  return function checker(req: Request, res: Response, next: NextFunction) {
    connection
      .query(checkUsernameQuery, [req.body.username])
      .then((result) => {
        if (result.rows.length > 0) {
          badRequest({
            res: res,
            code: 400,
            message: {
              tm: "Bu ulanyjy ady eýýäm bar",
              en: "This username is already in use",
            },
          });
        } else {
          if (isMiddleWare) {
            next();
          } else {
            res.json({
              error: false,
              message: {
                tm: "Ulanyjy adyny ulanmak mümkin",
                en: "This username is free",
              },
            });
          }
        }
      })
      .catch((err) => {
        badRequest({
          res: res,
          code: 400,
          message: {
            tm: "Bu ulanyjy ady eýýäm bar",
            en: "This username is already in use",
          },
        });
      });
  };
}

export function checkPhoneNumber(isMiddleWare: boolean = false) {
  return function checker(req: Request, res: Response, next: NextFunction) {
    if (isMiddleWare && req.body.phone_number === "") {
      next();
    } else {
      connection
        .query(checkPhoneNumberQuery, [req.body.phone_number])
        .then((result) => {
          if (result.rows.length > 0) {
            badRequest({
              res: res,
              code: 400,
              message: {
                tm: "Bu telefon belgi eýýäm bar",
                en: "This phone number is already in use",
              },
            });
          } else {
            if (isMiddleWare) {
              next();
            } else {
              res.json({
                error: false,
                message: {
                  tm: "Telefon belgisini ulanmak mümkin",
                  en: "This phone number is free",
                },
              });
            }
          }
        })
        .catch((err) => {
          badRequest({
            res: res,
            code: 400,
            message: {
              tm: "Bu telefon belgi eýýäm bar",
              en: "This phone number is already in use",
            },
          });
        });
    }
  };
}

export function signIn(req: Request<{}, {}, SignInDto>, res: Response) {
  const body = req.body;
  connection
    .query(checkUsernameQuery, [body.username])
    .then((result) => {
      if (result.rows.length > 0) {
        let user = result.rows[0];
        if (body.password===user.password) {
          user.password = body.password;
          let token = jwt.sign(user, SECRET_KEY);
          user.token = token;
          res.json(
            generateResponse({
              body: user,
            })
          );
        } else {
          badRequest({
            res,
            code: 403,
            message: {
              tm: "Nädogry açar sözi",
              en: "Invalid password",
            },
          });
        }
      } else {
        badRequest({
          res,
          code: 403,
          message: {
            tm: "Ulanyjy adyňyz nädogry",
            en: "Invalid username",
          },
        });
      }
    })
    .catch((err) => {
      badRequest({
        res: res,
        code: 500,
        message: {
          tm: err,
          en: err,
        },
      });
    });
}