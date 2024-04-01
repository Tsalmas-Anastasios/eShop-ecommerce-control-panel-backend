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




class ContactAddressesListService {


    async getList(params: { contact_id: string, connected_account_id: string, rec_id?: string }, req?: Request): Promise<ContactAddressData[]> {

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
                        contactAddresses${graphQueryParams !== '()' ? graphQueryParams : ''}{
                            rec_id
                            country
                            address
                            address_line_2
                            city
                            postal_code
                            contact_id
                        }
                    }
                `,
                contextValue: req || null,
            });



            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });


            const addresses: ContactAddressData[] = result.data.contactAddresses as ContactAddressData[];

            return Promise.resolve(addresses);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async getAddress(params: { contact_id: string, connected_account_id: string, rec_id?: string }, req?: Request): Promise<ContactAddressData> {

        try {

            const addresses: ContactAddressData[] = await this.getList(params, req || null);
            if (addresses.length === 0)
                return Promise.resolve(null);

            return Promise.resolve(addresses[0] as ContactAddressData);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class ContactAddressesUpdateService {


    async updateAddressRecord(data: ContactAddressData, address_identifiers: { connected_account_id: string, contact_id: string, address_id: string }): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    contact_address_data
                SET
                    ${data?.country && data?.country !== null ? `country = '${data.country}',` : ``}
                    ${data?.address && data?.address !== null ? `address = '${data.address}',` : ``}
                    ${data?.address_line_2 && data?.address_line_2 !== null ? `address_line_2 = '${data.address_line_2}',` : ``}
                    ${data?.postal_code && data?.postal_code !== null ? `postal_code = '${data.postal_code}',` : ``}
                    ${data?.city && data?.city !== null ? `city = '${data.city}',` : ``}
                    ${data?.postal_vault && data?.postal_vault !== null ? `postal_vault = '${data.postal_vault}',` : ``}
                    connected_account_id = :connected_account_id
                WHERE
                    rec_id = :rec_id AND
                    contact_id = :contact_id AND
                    connetced_account_id = :connected_account_id
            `, {
                rec_id: address_identifiers.address_id,
                contact_id: address_identifiers.contact_id,
                connected_account_id: address_identifiers.connected_account_id
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async updateMultipleAddresses(addresses: ContactAddressData[], existing_addresses: ContactAddressData[], connected_account_id: string, contact_id: string): Promise<void> {

        const existing_addresses_id: string[] = [];
        for (const address of addresses)
            existing_addresses_id.push(address.rec_id);



        let sql_string = '';
        for (const address of existing_addresses)
            if (!existing_addresses_id.includes(address.rec_id))
                sql_string += `
                    DELETE FROM
                        contact_address_data
                    WHERE
                        rec_id = '${address.rec_id}' AND
                        connected_account_id = '${connected_account_id} AND
                        contact_id = '${contact_id}';
                `;


        for (const address of addresses)
            if (!address?.rec_id || address.rec_id === '')
                sql_string += `
                    INSERT INTO
                        contact_address_data
                    SET
                        rec_id = '${contactNumbersIDGeneratorService.contactAddressID()}',
                        ${address?.country ? `country = '${address.country}',` : ``}
                        ${address?.address ? `address = '${address.address}',` : ``}
                        ${address?.address_line_2 ? `address_line_2 = '${address.address_line_2}',` : ``}
                        ${address?.postal_code ? `postal_code = '${address.postal_code}',` : ``}
                        ${address?.city ? `city = '${address.city}',` : ``}
                        ${address?.postal_vault ? `postal_vault = '${address.postal_vault}',` : ``}
                        connected_account_id = '${connected_account_id}',
                        contact_id = '${contact_id}';
                `;
            else
                sql_string += `
                    UPDATE
                        contact_address_data
                    SET
                        ${address?.country && address?.country !== null ? `country = '${address.country}',` : ``}
                        ${address?.address && address?.address !== null ? `address = '${address.address}',` : ``}
                        ${address?.address_line_2 && address?.address_line_2 !== null ? `address_line_2 = '${address.address_line_2}',` : ``}
                        ${address?.postal_code && address?.postal_code !== null ? `postal_code = '${address.postal_code}',` : ``}
                        ${address?.city && address?.city !== null ? `city = '${address.city}',` : ``}
                        ${address?.postal_vault && address?.postal_vault !== null ? `postal_vault = '${address.postal_vault}',` : ``}
                        connected_account_id = '${connected_account_id}'
                    WHERE
                        rec_id = '${address.rec_id}' AND
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





class ContactAddressesCheckerService {


    async addressExists(data: { address_id: string, contact_id: string, connected_account_id: string }): Promise<boolean> {

        try {

            const result = await mysql.query(`
                SELECT
                    rec_id
                FROM
                    contacts_address_data
                WHERE
                    rec_id = :rec_id AND
                    contact_id = :contact_id AND
                    connected_account_id = :connected_account_id
            `, {
                rec_id: data.address_id,
                contact_id: data.contact_id,
                connected_account_id: data.connected_account_id
            });

            if (result.rowsCount === 0)
                return Promise.resolve(false);

            return Promise.resolve(true);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class ContactAddressesDeleteService {


    async deleteAddress(data: { address_id: string, contact_id: string, connected_account_id: string }): Promise<void> {

        try {

            const result = await mysql.query(`
                DELETE FROM
                    contacts_addresses_data
                WHERE
                    rec_id = :rec_id AND
                    contact_id = :contact_id AND
                    connected_account_id = :connected_account_id
            `, {
                rec_id: data.address_id,
                contact_id: data.contact_id,
                connected_account_id: data.connected_account_id
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class ContactAddressesInsertService {


    async insertNewAddress(data: ContactAddressData, identifiers: { connected_account_id: string, contact_id: string }): Promise<string> {

        try {

            const rec_id = contactNumbersIDGeneratorService.contactAddressID();
            const result = await mysql.query(`
                INSERT INTO
                    contacts_address_data
                SET
                    rec_id = :rec_id,
                    country = :country,
                    address = :address,
                    ${data?.address_line_2 ? `address_line_2 = '${data.address_line_2}',` : ``}
                    postal_code = :postal_code,
                    city = :city,
                    ${data?.postal_vault ? `postal_vault = '${data.postal_vault}',` : ``}
                    connected_account_id = :connected_account_id,
                    contact_id = :contact_id
            `, {
                rec_id: rec_id,
                country: data.country,
                address: data.address,
                postal_code: data.postal_code,
                city: data.city,
                connected_account_id: identifiers.connected_account_id,
                contact_id: identifiers.contact_id,
            });

            return Promise.resolve(rec_id);

        } catch (error) {
            return Promise.reject(error);
        }

    }




    async insertMultipleAddresses(addresses: ContactAddressData[], identifiers: { connected_account_id: string, contact_id: string }): Promise<void> {

        let sql_string = '';
        for (const address of addresses)
            sql_string += `
                INSERT INTO
                    contacts_address_data
                SET
                    rec_id = '${contactNumbersIDGeneratorService.contactAddressID()}',
                    ${address?.country ? `country = '${address.country}',` : ``}
                    ${address?.address ? `address = '${address.address}',` : ``}
                    ${address?.address_line_2 ? `address_line_2 = '${address.address_line_2}',` : ``}
                    ${address?.postal_code ? `postal_code = '${address.postal_code}',` : ``}
                    ${address?.city ? `city = '${address.city}',` : ``}
                    ${address?.postal_vault ? `postal_vault = '${address.postal_vault}',` : ``}
                    connected_account_id = '${identifiers.connected_account_id}',
                    contact_id = '${identifiers.contact_id}';
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





const contactAddressesListService = new ContactAddressesListService();
const contactAddressesUpdateService = new ContactAddressesUpdateService();
const contactAddressesCheckerService = new ContactAddressesCheckerService();
const contactAddressesDeleteService = new ContactAddressesDeleteService();
const contactAddressesInsertService = new ContactAddressesInsertService();
export {
    contactAddressesListService, contactAddressesUpdateService, contactAddressesCheckerService,
    contactAddressesDeleteService, contactAddressesInsertService
};
