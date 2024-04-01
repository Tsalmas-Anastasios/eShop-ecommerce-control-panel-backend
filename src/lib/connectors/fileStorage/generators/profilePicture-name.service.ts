import { utils } from '../../../utils.service';
import { config } from '../../../../config';




class ProfilePictureNameGenerators {

    generateName(mimetype: string): string {
        const file_extension = mimetype.split('/');
        const today = new Date().toLocaleDateString();
        return `profilePicture_${utils.generateId(config.profilePictureName_length, config.profilePictureName_alphabet)}_cloudStorage_${utils.generateId(config.profilePictureName_length, config.profilePictureName_alphabet)}_${utils.convertToEpoch(today)}.${file_extension[1]}`;
    }

}



const profilePictureNameGenerators = new ProfilePictureNameGenerators();
export default profilePictureNameGenerators;
