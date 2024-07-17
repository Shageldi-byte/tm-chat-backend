import fs from "fs";
import { generateFromString } from "generate-avatar";
import { v4 as uuidv4 } from "uuid";

export const convertBase64 = (path: string) => {
  // read binary data from file
  const bitmap = fs.readFileSync(path);
  // convert the binary data to base64 encoded string
  return bitmap.toString('base64');
};

export function generateUUID(){
    return uuidv4();
}

export function generateRandomAvatar(str: string){
    return generateFromString(str);
}

export function getCurrentDate(): Date{
  let date = new Date();
  let m = date.getMonth() + 1;
  let str = `${date.getFullYear()}-${m}-${date.getDate()}`;
  return new Date(str);
}