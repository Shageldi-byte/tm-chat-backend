import { Response } from "express";

export interface IMessage{
    tm: string;
    en: string;
}

export interface IBadRequest{
    res: Response;
    code?: number;
    message?: IMessage;
}

export interface IResponse{
    code?: number;
    message?: IMessage;
    error?: boolean;
    body: any;
}

export const successMessage: IMessage={
    tm: 'Üstünlikli tamamlandy',
    en: 'Successfully completed'
}

export const generateResponse=(props: IResponse): IResponse=>{
    let code = 200;
    let message = successMessage;
    let error = false;
    if(props.code){
        code = props.code;
    }
    if(props.message){
        message = props.message;
    }
    if(props.error){
        error = props.error;
    }
    return {
        code,
        message,
        error,
        body: props.body,
    }
}

export const defaultErrorMessage: IMessage={
    tm: 'Ýalňyşlyk ýüze çykdy',
    en: 'Something went wrong'
}

export function badRequest(props: IBadRequest){
    let code = 400;
    let message = defaultErrorMessage;
    if(props.code){
        code = props.code;
    }

    if(props.message){
        message=props.message;
    }

    props.res.status(code).json({
        error: true,
        message: message,
        body: null
    })
}