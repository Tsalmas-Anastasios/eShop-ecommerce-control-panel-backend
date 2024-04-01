import { utils } from '../../lib/utils.service';
import { config } from '../../config';




class CompanyEmailIDGeneratorService {

    getCompanyEmailID(): string {
        return `ned_${utils.generateId(config.company_email_id_chars_length, config.nanoid_alphabet)}`;
    }

}


const companyEmailIDGeneratorService = new CompanyEmailIDGeneratorService();
export { companyEmailIDGeneratorService };
