import { utils } from '../../../utils.service';
import { config } from '../../../../config';




class ProductImagesNameGenerators {


    generateName(mimetype: string): string {
        const file_extension = mimetype.split('/');
        const today = new Date().toLocaleDateString();
        return `productImage_${utils.generateId(config.productImagesName_length, config.productImagesName_alphabet)}_cloudStorage_${utils.generateId(config.productImagesName_length, config.productImagesName_alphabet)}_${utils.convertToEpoch(today)}.${file_extension[1]}`;
    }


}



const productImagesNameGenerators = new ProductImagesNameGenerators();
export { productImagesNameGenerators };
