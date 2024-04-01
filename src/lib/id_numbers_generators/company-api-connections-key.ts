import { utils } from '../../lib/utils.service';
import { config } from '../../config';




class CompanyAPIConnectionsKeysIDGeneratorService {

    getAPITokenID(): string {
        return `tkn_${utils.generateId(config.company_api_connection_token_id_chars_length, config.nanoid_alphabet)}`;
    }

}



const companyAPIConnectionsKeysIDGeneratorService = new CompanyAPIConnectionsKeysIDGeneratorService();
export { companyAPIConnectionsKeysIDGeneratorService };
