import { Request } from 'express';
import {
    Contact, ContactLabel, ContactLabelName, ContactAddressData, ContactCustomFields, ContactEmailData,
    ContactPhoneData, ContactSearchDataArgs, ContactCustomFieldsArgumentsSearchListGraphQL
} from '../models';
import { utils } from './utils.service';
import { mysql } from './connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';
import * as jwt from 'jsonwebtoken';

import { contactNumbersIDGeneratorService } from './id_numbers_generators/contact';






class CustomFieldsListService {


    async getList(params?: ContactCustomFieldsArgumentsSearchListGraphQL, req?: Request): Promise<ContactCustomFields[]> {

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
                        contactCustomFields${graphQueryParams !== '()' ? graphQueryParams : ''}{
                            rec_id
                            label
                            value
                        }
                    }
                `,
                contextValue: req || null,
            });

            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });


            const custom_fields: ContactCustomFields[] = result.data.contactCustomFields as ContactCustomFields[];

            return Promise.resolve(custom_fields);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async getCustomField(params: ContactCustomFieldsArgumentsSearchListGraphQL, req?: Request): Promise<ContactCustomFields> {

        try {

            const custom_fields: ContactCustomFields[] = await this.getList(params, req || null);
            if (custom_fields.length === 0)
                return Promise.resolve(null);

            return Promise.resolve(custom_fields[0]);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class ContactCustomFieldsCheckerService {


    async customFieldExist(params: ContactCustomFieldsArgumentsSearchListGraphQL): Promise<boolean> {

        try {

            const result = await mysql.query(`
                SELECT
                    rec_id
                FROM
                    contacts_custom_field
                WHERE
                    rec_id = :rec_id AND
                    connected_account_id = :connected_account_id AND
                    contact_id = :contact_id
            `, {
                rec_id: params.rec_id,
                connected_account_id: params.connected_account_id,
                contact_id: params.contact_id
            });


            if (result.rowsCount === 0)
                return Promise.resolve(false);

            return Promise.resolve(true);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}





class ContactCustomFieldsUpdateService {


    async updateCustomField(data: ContactCustomFields): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    contacts_custom_fields
                SET
                    ${data?.label && data?.label !== null ? `label = '${data.label},` : ``}
                    ${data?.value && data?.value !== null ? `value = '${data.value},` : ``}
                    rec_id = :rec_id
                WHERE
                    rec_id = :rec_id AND
                    connected_account_id = :connected_account_id AND
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



    async updateMultipleCustomFields(fields: ContactCustomFields[], existing_fields: ContactCustomFields[], connected_account_id: string, contact_id: string): Promise<void> {

        const existing_fields_id: string[] = [];
        for (const field of fields)
            existing_fields_id.push(field.rec_id);



        let sql_string = '';
        for (const field of existing_fields)
            if (!existing_fields_id.includes(field.rec_id))
                sql_string += `
                    DELETE FROM
                        contacts_custom_fields
                    WHERE
                        rec_id = '${field.rec_id}' AND
                        connected_account_id = '${connected_account_id}' AND
                        contact_id = '${contact_id};
                `;



        for (const field of fields)
            if (field?.label && field?.value && field.label !== '' && field.value !== '')
                if (!field?.rec_id || field.rec_id === '')
                    sql_string += `
                        INSERT INTO
                            contact_custom_fields
                        SET
                            rec_id = '${contactNumbersIDGeneratorService.contactCustomFieldID()}',
                            label = '${field.label}',
                            value = '${field.value}',
                            connected_account_id = '${connected_account_id}',
                            contact_id = '${contact_id}'
                    `;
                else
                    sql_string += `
                        UPDATE
                            contact_custom_fields
                        SET
                            ${field?.label && field?.label !== null ? `label = '${field.label},` : ``}
                            ${field?.value && field?.value !== null ? `value = '${field.value},` : ``}
                            rec_id = '${field.rec_id}
                        WHERE
                            rec_id = '${field.rec_id}' AND
                            connected_account_id = '${connected_account_id}' AND
                            contact_id = '${contact_id}';
                    `;



        try {

            let result;
            if (sql_string !== '')
                result = await mysql.query(result);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}





class ContactCustomFieldsDeleteService {


    async deleteCustomFieldOne(params: ContactCustomFieldsArgumentsSearchListGraphQL): Promise<void> {

        try {

            const result = await mysql.query(`
                DELETE FROM
                    contacts_custom_field
                WHERE
                    rec_id = :rec_id AND
                    connected_account_id = :connected_account_Id AND
                    contact_id = :contact_id
            `, {
                rec_id: params.rec_id,
                connected_account_id: params.connected_account_id,
                contact_id: params.contact_id
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class ContactCustomFieldsInsertService {


    async insertNew(data: ContactCustomFields): Promise<string> {

        try {

            const rec_id = contactNumbersIDGeneratorService.contactCustomFieldID();
            const result = await mysql.query(`
                INSERT
                    contacts_custom_field
                SET
                    rec_id = :rec_id,
                    label = :label,
                    value = :value,
                    connected_account_id = :connected_account_id,
                    contact_id = :contact_id
            `, {
                rec_id: rec_id,
                label: data.label,
                value: data.value,
                connected_account_id: data.connected_account_id,
                contact_id: data.contact_id
            });


            return Promise.resolve(rec_id);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async insertMultipleFields(fields: ContactCustomFields[], connected_account_id: string, contact_id: string): Promise<void> {

        let sql_string = '';
        for (const field of fields)
            if (field?.label && field?.value && field.label !== '' && field.value !== '')
                sql_string += `
                    INSERT INTO
                        contacts_custom_field
                    SET
                        rec_id = '${contactNumbersIDGeneratorService.contactCustomFieldID()}',
                        label = '${field.label}',
                        value = '${field.value}',
                        connected_account_id = '${connected_account_id}',
                        contact_id = '${contact_id}'
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








const customFieldsListService = new CustomFieldsListService();
const contactCustomFieldsCheckerService = new ContactCustomFieldsCheckerService();
const contactCustomFieldsUpdateService = new ContactCustomFieldsUpdateService();
const contactCustomFieldsDeleteService = new ContactCustomFieldsDeleteService();
const contactCustomFieldsInsertService = new ContactCustomFieldsInsertService();
export {
    customFieldsListService, contactCustomFieldsCheckerService, contactCustomFieldsUpdateService,
    contactCustomFieldsDeleteService, contactCustomFieldsInsertService
};
