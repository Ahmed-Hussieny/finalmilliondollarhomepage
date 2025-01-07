import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { allowedExtension } from '../utils/allowedExtension.js';

export const multerMiddlewareLocal = ({
    extensions = allowedExtension.image,
})=>{
    const destination = path.resolve(`uploads`);
    if(!fs.existsSync(destination)){
        fs.mkdirSync(destination,{recursive:true});
    }
    const storage = multer.diskStorage({
        destination : (req, file, cb)=>{
            //^ cb(error, destination)
            cb(null, destination);
        },
        filename : (req, file, cb)=>{
            //^ cb(error, filename)
            cb(null,  Date.now()+ '-' +file.originalname);
        },
    });
    const fileFilter = (req, file, cb)=>{
        if(extensions.includes(file.mimetype.split('/')[1])){
            cb(null, true);
        }
        else{
            cb(new Error('File type is not supported'), false);
        }
    }
    const file = multer({fileFilter,storage});
    return file;
}