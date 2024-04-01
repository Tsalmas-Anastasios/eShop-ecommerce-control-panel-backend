import { utils } from './utils.service';
import { mysql } from './connectors/mysql';
import { config } from '../config';


class CreateNewShortingLink {



    async createNewLink(link: string): Promise<string> {

        try {

            const id = utils.generateId(18, config.nanoid_alphabet);

            const result = await mysql.query(`
                INSERT INTO
                    url_shortener
                SET
                    url_id = :url_id,
                    url_address = :url_address
            `, {
                url_id: id,
                url_address: link
            });


            return Promise.resolve(id);

        } catch (error) {
            return Promise.reject(error);
        }

    }



}






const createNewShortingLink = new CreateNewShortingLink();
export { createNewShortingLink };
