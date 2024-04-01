import { Request, Response, NextFunction } from 'express';
import * as multer from 'multer';
import { utils } from '../../utils.service';

import { contactPhotoNameGenerators } from './generators/contacts-photo.service';




class ContactPhotoFileStorage {

    private storageFolder = utils.path.join(__dirname, '../../../storage/company-logo');


    public diskStorage = multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, this.storageFolder);
            },
            filename: (req, file, cb) => {
                const filename = contactPhotoNameGenerators.generateName(file.mimetype);
                cb(null, filename);
            },
        }),
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
            cb(null, file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png');
        }
    });



    constructor() {
        this.createDiskStorageFolder();
    }



    private createDiskStorageFolder(): void {

        if (!utils.fs.existsSync(this.storageFolder))
            utils.fs.mkdirSync(this.storageFolder);

    }

}



const contactPhotoFileStorage = new ContactPhotoFileStorage();
export { contactPhotoFileStorage };
