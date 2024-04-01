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





class ContactLabelsList {


    async getList(params?: ContactLabel, req?: Request): Promise<ContactLabel[]> {

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
                        contactLabels${graphQueryParams !== '()' ? graphQueryParams : ''}{
                            rec_id
                            label_id
                            label
                        }
                    }
                `,
                contextValue: req || null,
            });

            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });

            const contact_labels: ContactLabel[] = result.data.contactLabels as ContactLabel[];


            return Promise.resolve(contact_labels);

        } catch (error) {
            return Promise.reject(error);
        }

    }




    async getSpecificLabel(params: ContactLabel, req?: Request): Promise<ContactLabel> {

        try {

            const contact_labels: ContactLabel[] = await this.getList(params, req || null);
            if (contact_labels.length === 0)
                return Promise.resolve(null);

            return Promise.resolve(contact_labels[0] as ContactLabel);

        } catch (error) {
            return Promise.reject(error);
        }

    }



}




class UpdateContactLabelService {

    async updateContactLabel(data: ContactLabel): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    contact_labels
                SET
                    label_id = :label_id
                WHERE
                    rec_id = :rec_id AND
                    connected_account_id = :connected_account_id AND
                    contact_id = :contact_id
            `, {
                label_id: data.label_id,
                rec_id: data.rec_id,
                connected_account_id: data.connected_account_id,
                contact_id: data.contact_id
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }


    async updateMultipleLabels(labels: ContactLabel[], existing_labels: ContactLabel[], connected_account_id: string, contact_id: string): Promise<void> {

        const existing_labels_id: string[] = [];
        for (const label of labels)
            existing_labels_id.push(label.rec_id);



        let sql_string = '';
        for (const label of existing_labels)
            if (!existing_labels_id.includes(label.rec_id))
                sql_string += `
                    DELETE FROM
                        contact_labels
                    WHERE
                        rec_id = '${label.rec_id}' AND
                        connected_account_id = '${connected_account_id}' AND
                        contact_id = '${contact_id}';
                `;


        for (const label of labels)
            if (!label?.rec_id || label.rec_id === '')
                sql_string += `
                    INSERT INTO
                        contact_labels
                    SET
                        rec_id = '${contactNumbersIDGeneratorService.contactLabelID()}',
                        label_id = '${label.label_id}',
                        connected_account_id = '${connected_account_id}',
                        contact_id = '${contact_id}';
                `;
            else
                sql_string += `
                    UPDATE
                        contact_labels
                    SET
                        label_id = '${label.label_id}'
                    WHERE
                        rec_id = '${label.rec_id}' AND
                        connected_account_id = '${connected_account_id}' AND
                        contact_id = '${contact_id}';
                `;




        try {

            let result;
            if (sql_string !== '')
                result = await mysql.query(sql_string);

        } catch (error) {
            return Promise.reject(error);
        }

    }

}





class DeleteContactLabelService {

    async deleteContactLabel(data: { rec_id: string, connected_account_id: string, contact_id: string }): Promise<void> {

        try {

            const result = await mysql.query(`
                DELETE FROM
                    contact_labels
                WHERE
                    rec_id = :rec_id,
                    connected_account_id = :connected_account_id,
                    contact_id = :contact_id
            `, {
                rec_id: data.rec_id,
                connected_account_id: data.connected_account_id,
                contact_id: data.contact_id
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }

}




class AddNewContactLabelService {


    async addNewContactLabel(data: ContactLabel): Promise<string> {

        try {

            const rec_id = contactNumbersIDGeneratorService.contactLabelID();

            const result = await mysql.query(`
                INSERT INTO
                    contact_labels
                SET
                    rec_id = :rec_id,
                    label_id = :label_id,
                    connected_account_id = :connected_account_id,
                    contact_id = :contact_id
            `, {
                rec_id: rec_id,
                label_id: data.label_id,
                connected_account_id: data.connected_account_id,
                contact_id: data.contact_id,
            });


            return Promise.resolve(rec_id);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async addMultipleLabels(labels: ContactLabel[], connected_account_id: string, contact_id: string): Promise<void> {

        let sql_string = '';
        for (const label of labels)
            sql_string += `
                INSERT INTO
                    contact_labels
                SET
                    rec_id = '${contactNumbersIDGeneratorService.contactLabelID()}',
                    label_id = '${label.label_id}',
                    connected_account_id = '${connected_account_id}',
                    contact_id = '${contact_id}';
            `;



        try {

            let result;
            if (sql_string !== '')
                result = await mysql.query(sql_string);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}





const contactLabelsList = new ContactLabelsList();
const updateContactLabelService = new UpdateContactLabelService();
const deleteContactLabelService = new DeleteContactLabelService();
const addNewContactLabelService = new AddNewContactLabelService();
export {
    contactLabelsList, updateContactLabelService, deleteContactLabelService, addNewContactLabelService
};
