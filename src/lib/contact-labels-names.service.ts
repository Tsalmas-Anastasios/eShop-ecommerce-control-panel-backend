import { Request } from 'express';
import {
    Contact, ContactLabel, ContactLabelName, ContactAddressData, ContactCustomFields, ContactEmailData,
    ContactPhoneData, ContactSearchDataArgs
} from '../models';
import { utils } from './utils.service';
import { mysql } from './connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';
import * as jwt from 'jsonwebtoken';

import { contactNumbersIDGeneratorService } from './id_numbers_generators/contact';





class ContactLabelsNamesListService {


    async getList(params?: ContactLabelName, req?: Request): Promise<ContactLabelName[]> {

        try {

            let graphQueryParams = '';

            if (params && !utils.lodash.isEmpty(params)) {

                graphQueryParams += '(';

                // tslint:disable-next-line:curly
                let i = 0;
                for (const key in params) {
                    if (i > 0)
                        graphQueryParams += ',';

                    if (typeof params[key] === 'number')
                        graphQueryParams += `${key}: ${params[key]}`;
                    else
                        graphQueryParams += `${key}: "${params[key]}"`;

                    i++;

                }

                graphQueryParams += ')';

            }


            const result = await graphql({
                schema: schema,
                source: `
                    {
                        contactLabelsNames${graphQueryParams !== '()' ? graphQueryParams : ''}{
                            label_id
                            label
                        }
                    }
                `,
                contextValue: req || null,
            });

            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });


            const labels: ContactLabelName[] = result.data.contactLabelsNames as ContactLabelName[];
            return Promise.resolve(labels);

        } catch (error) {
            return Promise.reject(error);
        }

    }


    async getLabel(params: ContactLabelName, req?: Request): Promise<ContactLabelName> {

        try {

            const labels = await this.getList(params, req || null);
            if (labels.length === 0)
                return Promise.resolve(null);

            return Promise.resolve(labels[0]);

        } catch (error) {
            return Promise.reject(error);
        }

    }


    async labelExists(label_id: string, connected_account_id: string): Promise<boolean> {

        try {

            const result = await mysql.query(`
                SELECT
                    label_id
                FROM
                    contact_labels_names
                WHERE
                    label_id = :label_id AND
                    connected_account_id = :connected_account_id
            `, {
                label_id: label_id,
                connected_account_id: connected_account_id
            });


            if (result.rowsCount === 0)
                return Promise.resolve(false);

            return Promise.resolve(true);

        } catch (error) {
            return Promise.reject(error);
        }

    }

}




class UpdateContactLabelNameService {


    async updateLabel(data: ContactLabelName): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    contact_labels_names
                SET
                    label = :label
                WHERE
                    label = :label_id AND
                    connected_account_id = :connected_account_id
            `, {
                label: data.label,
                label_id: data.label_id,
                connected_account_id: data.connected_account_id
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }


}





class DeleteCOntactLabelNameService {

    async deleteLabel(data: { label_id: string, connected_account_id: string }): Promise<void> {

        try {

            const result = await mysql.query(`
                DELETE FROM
                    contact_labels_names
                WHERE
                    label_id = :label_id AND
                    connected_account_id = :connected_account_id
            `, {
                label_id: data.label_id,
                connected_account_id: data.connected_account_id,
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }

}



class InsertNewContactLabelsNameService {


    async addNewLabel(data: ContactLabelName): Promise<string> {

        try {

            const label_id = contactNumbersIDGeneratorService.contactLabelNameID();

            const label_exist_result = await mysql.query(`SELECT label_id FROM contact_labels_names WHERE label = :label`, { label: data.label });
            if (label_exist_result.rowsCount > 0)
                return Promise.resolve(null);


            const result = await mysql.query(`
                INSERT INTO
                    contact_labels_names
                SET
                    label_id = :label_id,
                    label = :label,
                    connected_account_id = :connected_account_id
            `, {
                label_id: label_id,
                label: data.label,
                connected_account_id: data.connected_account_id,
            });


            return Promise.resolve(label_id);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}







const contactLabelsNamesListService = new ContactLabelsNamesListService();
const updateContactLabelNameService = new UpdateContactLabelNameService();
const deleteCOntactLabelNameService = new DeleteCOntactLabelNameService();
const insertNewContactLabelsNameService = new InsertNewContactLabelsNameService();
export {
    contactLabelsNamesListService, updateContactLabelNameService, deleteCOntactLabelNameService,
    insertNewContactLabelsNameService
};
