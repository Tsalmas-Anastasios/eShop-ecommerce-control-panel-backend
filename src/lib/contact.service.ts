import { Request } from 'express';
import {
    Contact, ContactLabel, ContactLabelName, ContactAddressData, ContactCustomFields, ContactEmailData,
    ContactPhoneData, ContactSearchDataArgs
} from '../models';
import { utils } from '../lib/utils.service';
import { mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';
import * as jwt from 'jsonwebtoken';

import { contactNumbersIDGeneratorService } from './id_numbers_generators/contact';




class ContactsListService {


    async getList(params?: ContactSearchDataArgs, req?: Request): Promise<Contact[]> {

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
                        contacts${graphQueryParams !== '()' ? graphQueryParams : ''}{
                            contact_id
                            image_url
                            prefix
                            name
                            father_name
                            surname
                            suffix
                            mother_name
                            name_in_speaking_format
                            father_name_in_speaking_format
                            alias
                            archive_as
                            company
                            work_position_title
                            work_department
                            date_of_birth
                            website
                            notes
                            private
                            private_user_id
                            favorite

                            contact_labels{
                                rec_id
                                label_id
                                label
                            }

                            addresses{
                                rec_id
                                country
                                address
                                address_line_2
                                city
                                postal_code
                            }

                            custom_fields{
                                rec_id
                                label
                                value
                            }

                            emails{
                                rec_id
                                label
                                value
                            }

                            phones{
                                rec_id
                                label
                                phone
                            }
                        }
                    }
                `,
                contextValue: req || null,
            });

            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });


            const contacts: Contact[] = result.data.contacts as Contact[];

            return Promise.resolve(contacts);

        } catch (error) {
            return Promise.reject(error);
        }

    }




    async getContact(params: ContactSearchDataArgs, req?: Request): Promise<Contact> {

        try {

            const contacts: Contact[] = await this.getList(params, req || null);
            if (contacts.length === 0)
                return Promise.resolve(null);

            return Promise.resolve(contacts[0] as Contact);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async contactExists(contact_id: string, connected_account_id: string): Promise<boolean> {

        try {

            const result = await mysql.query(`
                SELECT
                    contact_id
                FROM
                    contacts
                WHERE
                    contact_id = :contact_id AND
                    connected_account_id = :connected_account_id
            `, {
                contact_id: contact_id,
                connected_account_id: connected_account_id,
            });


            if (result.rowsCount === 0)
                return Promise.resolve(false);

            return Promise.resolve(true);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class UpdateContactService {


    async updateContact(data: Contact): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    contacts
                SET
                    ${data?.prefix && data?.prefix !== null ? `prefix = '${data.prefix}',` : ``}
                    ${data?.name && data?.name !== null ? `name = '${data.name}',` : ``}
                    ${data?.father_name && data?.father_name !== null ? `father_name = '${data.father_name}',` : ``}
                    ${data?.surname && data?.surname !== null ? `surname = '${data.surname}',` : ``}
                    ${data?.suffix && data?.suffix !== null ? `suffix = '${data.suffix}',` : ``}
                    ${data?.mother_name && data?.mother_name !== null ? `mother_name = '${data.mother_name}',` : ``}
                    ${data?.name_in_speaking_format && data?.name_in_speaking_format !== null ? `name_in_speaking_format = '${data.name_in_speaking_format}',` : ``}
                    ${data?.father_name_in_speaking_format && data?.father_name_in_speaking_format !== null ? `father_name_in_speaking_format = '${data.father_name_in_speaking_format}',` : ``}
                    ${data?.alias && data?.alias !== null ? `alias = '${data.alias}',` : ``}
                    ${data?.archive_as && data?.archive_as !== null ? `archive_as = '${data.archive_as}',` : ``}
                    ${data?.company && data?.company !== null ? `company = '${data.company}',` : ``}
                    ${data?.work_position_title && data?.work_position_title !== null ? `work_position_title = '${data.work_position_title}',` : ``}
                    ${data?.work_department && data?.work_department !== null ? `work_department = '${data.work_department}',` : ``}
                    ${data?.date_of_birth && data?.date_of_birth !== null ? `date_of_birth = '${data.date_of_birth}',` : ``}
                    ${data?.website && data?.website !== null ? `website = '${data.website}',` : ``}
                    ${data?.notes && data?.notes !== null ? `notes = '${data.notes}',` : ``}
                    ${data?.private && data?.private !== null ? `private = ${data.private ? 1 : 0},` : ``}
                    ${data?.private_user_id && data?.private_user_id !== null ? `private_user_id = '${data.private_user_id}',` : ``}
                    ${data?.favorite && data?.favorite !== null ? `favorite = ${data.favorite ? 1 : 0},` : ``}
                    contact_id = :contact_id
                WHERE
                    contact_id = :contact_id AND
                    connected_account_id = :connected_account_id;
            `, {
                contact_id: data.contact_id,
                connected_account_id: data.connected_account_id,
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class AddContactService {


    async addContact(data: Contact): Promise<string> {

        try {

            const contact_id = contactNumbersIDGeneratorService.contactID();

            const result = await mysql.query(`
                INSERT INTO
                    contacts
                SET
                    contact_id = :contact_id,
                    connected_account_id = :connected_account_id,
                    ${data?.prefix ? `prefix = '${data.prefix}',` : ``}
                    ${data?.father_name ? `father_name = '${data.father_name}',` : ``}
                    ${data?.surname ? `surname = '${data.surname}',` : ``}
                    ${data?.suffix ? `suffix = '${data.suffix}',` : ``}
                    ${data?.mother_name ? `mother_name = '${data.mother_name}',` : ``}
                    ${data?.name_in_speaking_format ? `name_in_speaking_format = '${data.name_in_speaking_format}',` : ``}
                    ${data?.father_name_in_speaking_format ? `father_name_in_speaking_format = '${data.father_name_in_speaking_format}',` : ``}
                    ${data?.alias ? `alias = '${data.alias}',` : ``}
                    ${data?.archive_as ? `archive_as = '${data.archive_as}',` : ``}
                    ${data?.company ? `company = '${data.company}',` : ``}
                    ${data?.work_position_title ? `work_position_title = '${data.work_position_title}',` : ``}
                    ${data?.work_department ? `work_department = '${data.work_department}',` : ``}
                    ${data?.date_of_birth ? `date_of_birth = '${data.date_of_birth}',` : ``}
                    ${data?.website ? `website = '${data.website}',` : ``}
                    ${data?.notes ? `notes = '${data.notes}',` : ``}
                    ${data?.private && data?.private !== null ? `private = ${data.private ? 1 : 0},` : ``}
                    ${data?.private_user_id && data?.private_user_id !== null ? `private_user_id = '${data.private_user_id}',` : ``}
                    ${data?.favorite && data?.favorite !== null ? `favorite = ${data.favorite ? 1 : 0},` : ``}
                    name = :name
            `, {
                contact_id: contact_id,
                connected_account_id: data.connected_account_id,
                name: data.name,
            });

            return Promise.resolve(contact_id);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}






class ContactsCheckerService {


    async contactExists(data: { contact_id: string, connected_account_id: string }): Promise<boolean> {

        try {

            const result = await mysql.query(`
                SELECT
                    contact_id
                FROM
                    contacts
                WHERE
                    contact_id = :contact_id AND
                    connected_account_id = :connected_account_id
            `, {
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





const contactsListService = new ContactsListService();
const updateContactService = new UpdateContactService();
const addContactService = new AddContactService();
const contactsCheckerService = new ContactsCheckerService();
export { contactsListService, updateContactService, addContactService, contactsCheckerService };
