import { Request, Response, NextFunction } from 'express';
import * as multer from 'multer';
import { utils } from '../../utils.service';

import { orderPapersNameGenerators } from './generators/orderPapers-name.service';




class OrderPapersFileStorage {

    private storageFolder = utils.path.join(__dirname, '../../../storage/order-papers');

    public diskStorage = multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, this.storageFolder);
            },
            filename: (req, file, cb) => {
                const filename = orderPapersNameGenerators.generateName(file.mimetype);
                cb(null, filename);
            },
        }),
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
            cb(null, file.mimetype === 'application/pdf');
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




const orderPapersFileStorage = new OrderPapersFileStorage();
export { orderPapersFileStorage };
