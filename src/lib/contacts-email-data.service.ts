import { Request } from 'express';
import {
    Contact, ContactLabel, ContactLabelName, ContactAddressData, ContactCustomFields, ContactEmailData,
    ContactPhoneData, ContactSearchDataArgs, ContactEmailDataSearchParamsGraphQL
} from '../models';
import { utils } from './utils.service';
import { mysql } from './connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';
import * as jwt from 'jsonwebtoken';

import { contactNumbersIDGeneratorService } from './id_numbers_generators/contact';







class ContactsEmailDataListService {


    async getList(params?: ContactEmailDataSearchParamsGraphQL, req?: Request): Promise<ContactEmailData[]> {

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
                        contactEmails${graphQueryParams !== '()' ? graphQueryParams : ''}{
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


            const email_data: ContactEmailData[] = result.data.contactEmails as ContactEmailData[];

            return Promise.resolve(email_data);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async getEmail(params: ContactEmailDataSearchParamsGraphQL, req?: Request): Promise<ContactEmailData> {

        try {

            const email_data: ContactEmailData[] = await this.getList(params, req || null);
            if (email_data.length > 0)
                return Promise.resolve(null);

            return Promise.resolve(email_data[0] as ContactEmailData);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}



class ContactEmailDataCheckerService {


    async emailExists(params: ContactEmailDataSearchParamsGraphQL): Promise<boolean> {

        try {

            const result = await mysql.query(`
                SELECT
                    rec_id
                FROM
                    contacts_email_data
                WHERE
                    rec_id = :rec_id AND
                    connected_account_id = :connected_account_id AND
                    contact_id = :contact_id
            `, {
                rec_id: params.rec_id,
                connected_account_id: params.connected_account_id,
                contact_id: params.contact_id
            });


            if (result.rowsCount)
                return Promise.resolve(false);

            return Promise.resolve(true);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}



class ContactEmailDataUpdateService {


    async updateEmail(data: ContactEmailData): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    contacts_email_data
                SET
                    ${data?.label && data?.label !== null ? `label = '${data.label}',` : ``}
                    ${data?.value && data?.value !== null ? `value = '${data.value}',` : ``}
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




    async updateMultipleEmails(emails: ContactEmailData[], existing_emails: ContactEmailData[], connected_account_id: string, contact_id: string): Promise<void> {

        const existing_emails_id: string[] = [];
        for (const email of emails)
            existing_emails_id.push(email.rec_id);



        let sql_string = '';
        for (const email of existing_emails)
            if (!existing_emails_id.includes(email.rec_id))
                sql_string += `
                    DELETE FROM
                        contacts_email_data
                    WHERE
                        rec_id = '${email.rec_id}' AND
                        connected_account_id = '${connected_account_id}' AND
                        contact_id = '${contact_id}';
                `;



        for (const email of emails)
            if (email?.label && email?.value && email.label !== '' && email.value !== '')
                if (!email?.rec_id || email.rec_id === '')
                    sql_string += `
                        INSERT INTO
                            contacts_email_data
                        SET
                            rec_id = '${contactNumbersIDGeneratorService.contactEmailID()}',
                            label = '${email.label}',
                            value = '${email.value}',
                            connected_account_id = '${connected_account_id}',
                            contact_id = '${contact_id};
                    `;
                else
                    sql_string += `
                        UPDATE
                            contacts_email_data
                        SET
                            ${email?.label && email?.label !== null ? `label = '${email.label}',` : ``}
                            ${email?.value && email?.value !== null ? `value = '${email.value}',` : ``}
                            rec_id = '${email.rec_id}'
                        WHERE
                            rec_id = '${email.rec_id}' AND
                            connected_account_id = '${connected_account_id}' AND
                            contact_id = '${contact_id};
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




class ContactEmailDataDeleteService {


    async deleteEmail(params: ContactEmailDataSearchParamsGraphQL): Promise<void> {

        try {

            const result = await mysql.query(`
                DELETE FROM
                    contacts_email_data
                WHERE
                    rec_id = :rec_id AND
                    connected_account_id = :connected_account_id AND
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




class ContactEmailDataInsertService {



    async addNewEmail(data: ContactEmailData): Promise<string> {

        try {

            const rec_id = contactNumbersIDGeneratorService.contactEmailID();
            const result = await mysql.query(`
                INSERT INTO
                    contacts_email_data
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



    async addMultipleEmails(emails: ContactEmailData[], connected_account_id: string, contact_id: string): Promise<void> {

        let sql_string = '';
        for (const email of emails)
            if (email?.label && email?.value && email.label !== '' && email.value !== '')
                sql_string += `
                    INSERT INTO
                        contacts_email_data
                    SET
                        rec_id = '${contactNumbersIDGeneratorService.contactEmailID()}',
                        label = '${email.label}',
                        value = '${email.value}',
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







const contactsEmailDataListService = new ContactsEmailDataListService();
const contactEmailDataCheckerService = new ContactEmailDataCheckerService();
const contactEmailDataUpdateService = new ContactEmailDataUpdateService();
const contactEmailDataDeleteService = new ContactEmailDataDeleteService();
const contactEmailDataInsertService = new ContactEmailDataInsertService();
export {
    contactsEmailDataListService, contactEmailDataCheckerService, contactEmailDataUpdateService,
    contactEmailDataDeleteService, contactEmailDataInsertService
};
