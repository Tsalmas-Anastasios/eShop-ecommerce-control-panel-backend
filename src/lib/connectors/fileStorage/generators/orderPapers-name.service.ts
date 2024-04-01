import { utils } from '../../../utils.service';
import { config } from '../../../../config';




class OrderPapersNameGenerators {

    generateName(mimetype: string): string {
        const file_extension = mimetype.split('/');
        const now = new Date().toISOString();
        return `orderPapers_${utils.generateId(config.orderPapersName_length, config.orderPapersName_alphabet)}_cloudStorage_${utils.generateId(config.orderPapersName_length, config.orderPapersName_alphabet)}_${utils.convertToEpoch(now)}.${file_extension[1]}`;
    }

}



const orderPapersNameGenerators = new OrderPapersNameGenerators();
export { orderPapersNameGenerators };
