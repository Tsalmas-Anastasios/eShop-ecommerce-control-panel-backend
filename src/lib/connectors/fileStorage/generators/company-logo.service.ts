import { utils } from '../../../utils.service';
import { config } from '../../../../config';




class CompanyLogoNameGenerators {

    generateName(mimetype: string): string {
        const file_extension = mimetype.split('/');
        const now = new Date().toISOString();
        return `companyLogo_${utils.generateId(config.companyLogoName_length, config.companyLogoName_alphabet)}_cloudStorage_${utils.generateId(config.companyLogoName_length, config.companyLogoName_alphabet)}_${utils.convertToEpoch(now)}.${file_extension[1]}`;
    }

}



const companyLogoNameGenerators = new CompanyLogoNameGenerators();
export { companyLogoNameGenerators };
