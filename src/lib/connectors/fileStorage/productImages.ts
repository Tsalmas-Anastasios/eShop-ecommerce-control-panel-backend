import { Request, Response, NextFunction } from 'express';
import * as multer from 'multer';
import { utils } from '../../utils.service';

import { productImagesNameGenerators } from './generators/productImages-name.service';




class ProductImagesFileStorage {

    private storageFolder = utils.path.join(__dirname, '../../../storage/product-images');

    public diskStorage = multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, this.storageFolder);
            },
            filename: (req, file, cb) => {
                const filename = productImagesNameGenerators.generateName(file.mimetype);
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



const productImagesFileStorage = new ProductImagesFileStorage();
export { productImagesFileStorage };
