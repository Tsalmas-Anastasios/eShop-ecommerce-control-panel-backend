import { Request, Response } from 'express';
import {
    Contact, ContactLabel, ContactLabelName, ContactAddressData, ContactCustomFields, ContactEmailData,
    ContactPhoneData, ContactSearchDataArgs, ContactPhoneDataSearchGraphQLData
} from '../models';
import { utils } from './utils.service';
import { mysql } from './connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';
import * as jwt from 'jsonwebtoken';

import { contactNumbersIDGeneratorService } from './id_numbers_generators/contact';





class ContactPhonesDataListService {


    async getList(params?: ContactPhoneDataSearchGraphQLData, req?: Request): Promise<ContactPhoneData[]> {

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
                        contactPhones${graphQueryParams !== '()' ? graphQueryParams : ''}{
                            rec_id
                            label
                            phone
                        }
                    }
                `,
                contextValue: req || null,
            });

            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });


            const phone_data: ContactPhoneData[] = result.data.contactPhones as ContactPhoneData[];

            return Promise.resolve(phone_data);

        } catch (error) {
            return Promise.reject(error);
        }

    }


    async getPhone(params: ContactPhoneDataSearchGraphQLData, req?: Request): Promise<ContactPhoneData> {

        try {

            const phone_data: ContactPhoneData[] = await this.getList(params, req || null);
            if (phone_data.length === 0)
                return Promise.resolve(null);

            return Promise.resolve(phone_data[0] as ContactPhoneData);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}



class ContactPhoneDataCheckerService {


    async phoneExists(data: ContactPhoneDataSearchGraphQLData): Promise<boolean> {

        try {

            const result = await mysql.query(`
                SELECT
                    rec_id
                FROM
                    contacts_phone_data
                WHERE
                    rec_id = :rec_id AND
                    connected_account_id = :connected_account_id AND
                    contact_id = :contact_id
            `, {
                rec_id: data.rec_id,
                connected_account_id: data.connected_account_id,
                contact_id: data.contact_id
            });


            if (result.rowsCount === 0)
                return Promise.resolve(false);

            return Promise.resolve(true);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}



class ContactPhoneDataUpdateService {


    async updatePhone(data: ContactPhoneData): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    contacts_phone_data
                SET
                    ${data?.label && data?.label !== null ? `label = '${data.label}',` : ``}
                    ${data?.phone && data?.phone !== null ? `phone = '${data.phone}',` : ``}
                    rec_id = :rec_id
                WHERE
                    rec_id = :rec_id AND
                    connected_account_id = :connected_account_id AND
                    contact_id = :contact_id
            `, {
                rec_id: data.rec_id
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }




    async updateMultiplePhones(phones: ContactPhoneData[], existing_phones: ContactPhoneData[], connected_account_id: string, contact_id: string): Promise<void> {


        const existing_phones_id: string[] = [];
        for (const phone of phones)
            if (phone?.rec_id)
                existing_phones_id.push(phone.rec_id);



        // create sql string
        let sql_string = '';
        for (const phone of existing_phones)
            if (!existing_phones_id.includes(phone.rec_id))
                sql_string += `
                    DELETE FROM
                        contacts_phone_data
                    WHERE
                        rec_id = '${phone.rec_id}' AND
                        contact_id = '${contact_id}' AND
                        connected_account_id = '${connected_account_id}';
                `;



        for (const phone of phones)
            if (phone?.label && phone?.phone && phone.label !== '' && phone.phone !== '')
                if (!phone?.rec_id || phone.rec_id === '')
                    sql_string += `
                        INSERT INTO
                            contacts_phone_data
                        SET
                            rec_id = '${contactNumbersIDGeneratorService.contactPhoneID()}',
                            label = '${phone.label}',
                            phone = '${phone.phone}',
                            connected_account_id = '${connected_account_id}',
                            contact_id = '${contact_id}';
                    `;
                else
                    sql_string += `
                        UPDATE
                            contacts_phone_data
                        SET
                            ${phone?.label && phone?.label !== null ? `label = '${phone.label}',` : ``}
                            ${phone?.phone && phone?.phone !== null ? `phone = '${phone.phone}',` : ``}
                            rec_id = '${phone.rec_id}'
                        WHERE
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



class ContactPhoneDataDeleteService {


    async deletePhone(params: ContactPhoneDataSearchGraphQLData): Promise<void> {

        try {

            const result = await mysql.query(`
                DELETE FROM
                    contacts_phone_data
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



class ContactPhoneDataInsertService {


    async insertPhone(data: ContactPhoneData): Promise<string> {

        try {

            const rec_id = contactNumbersIDGeneratorService.contactPhoneID();
            const result = await mysql.query(`
                INSERT INTO
                    contacts_phone_data
                SET
                    rec_id = :rec_id,
                    label = :label,
                    phone = :phone,
                    connected_account_id = :connected_account_id,
                    contact_id = :contact_id
            `, {
                rec_id: rec_id,
                label: data.label,
                phone: data.phone,
                connected_account_id: data.connected_account_id,
                contact_id: data.contact_id
            });


            return Promise.resolve(rec_id);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async insertMultiplePhones(phones: ContactPhoneData[], connected_account_id: string, contact_id: string): Promise<void> {

        let sql_string = '';
        for (const phone of phones)
            if (phone?.label && phone?.phone && phone.label !== '' && phone.phone !== '')
                sql_string += `
                    INSERT INTO
                        contacts_phone_data
                    SET
                        rec_id = '${contactNumbersIDGeneratorService.contactPhoneID()}',
                        label = '${phone.label}',
                        phone = '${phone.phone}',
                        connected_account_id = '${connected_account_id}',
                        contact_id = '${contact_id}';
                `;




        try {

            let response;
            if (sql_string !== '')
                response = await mysql.query(sql_string);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}








const contactPhonesDataListService = new ContactPhonesDataListService();
const contactPhoneDataCheckerService = new ContactPhoneDataCheckerService();
const contactPhoneDataUpdateService = new ContactPhoneDataUpdateService();
const contactPhoneDataDeleteService = new ContactPhoneDataDeleteService();
const contactPhoneDataInsertService = new ContactPhoneDataInsertService();
export {
    contactPhonesDataListService, contactPhoneDataCheckerService, contactPhoneDataUpdateService,
    contactPhoneDataDeleteService, contactPhoneDataInsertService
};
