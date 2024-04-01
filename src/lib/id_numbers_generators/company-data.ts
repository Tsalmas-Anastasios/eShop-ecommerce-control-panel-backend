import { utils } from '../../lib/utils.service';
import { config } from '../../config';




class CompanyDataIDGeneratorService {

    getCompanyDataID(): string {
        return utils.generateId(config.company_data_id_length_chars, config.nanoid_alphabet);
    }

}



const companyDataIDGeneratorService = new CompanyDataIDGeneratorService();
export { companyDataIDGeneratorService };
