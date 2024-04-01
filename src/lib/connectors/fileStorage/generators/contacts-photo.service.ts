import { utils } from '../../../utils.service';
import { config } from '../../../../config';



class ContactPhotoNameGenerators {

    generateName(mimetype: string): string {
        const file_extension = mimetype.split('/');
        const now = new Date().toISOString();
        return `contactPhoto_${utils.generateId(config.contacts_photo_nameLength, config.contacts_photo_name_alphabet)}_cloudStorage_${utils.generateId(config.contacts_photo_nameLength, config.contacts_photo_name_alphabet)}_${utils.convertToEpoch(now)}.${file_extension}`;
    }

}


const contactPhotoNameGenerators = new ContactPhotoNameGenerators();
export { contactPhotoNameGenerators };
