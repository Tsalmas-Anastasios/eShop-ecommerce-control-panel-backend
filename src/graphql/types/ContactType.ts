import { Contact, ContactLabel, ContactAddressData, ContactCustomFields, ContactPhoneData, ContactEmailData } from '../../models';
import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';

import { ContactLabelType } from './ContactLabelType';
import { ContactAddressType } from './ContactAddressType';
import { ContactCustomFieldType } from './ContactCustomFieldType';
import { ContactEmailType } from './ContactEmailType';
import { ContactPhoneType } from './ContactPhoneType';




// tslint:disable-next-line:variable-name
const ContactType = new GraphQLObjectType({

    name: 'ContactType',
    fields: () => ({

        contact_id: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },
        image_url: { type: GraphQLString },
        prefix: { type: GraphQLString },
        name: { type: GraphQLString },
        father_name: { type: GraphQLString },
        surname: { type: GraphQLString },
        suffix: { type: GraphQLString },
        mother_name: { type: GraphQLString },
        name_in_speaking_format: { type: GraphQLString },
        father_name_in_speaking_format: { type: GraphQLString },
        alias: { type: GraphQLString },
        archive_as: { type: GraphQLString },
        company: { type: GraphQLString },
        work_position_title: { type: GraphQLString },
        work_department: { type: GraphQLString },
        date_of_birth: { type: GraphQLString },
        website: { type: GraphQLString },
        notes: { type: GraphQLString },
        private: { type: GraphQLBoolean },
        private_user_id: { type: GraphQLString },
        favorite: { type: GraphQLBoolean },

        contact_labels: {
            type: new GraphQLList(ContactLabelType),
            resolve: async (contact: Contact, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            contact_labels
                        WHERE
                            contact_id = :contact_id AND
                            connected_account_id = :connected_account_id
                    `, {
                        contact_id: contact.contact_id,
                        connected_account_id: contact.connected_account_id,
                    });


                    for (const row of result.rows)
                        if (row.data && typeof row.data === 'string')
                            row.data = JSON.parse(row.data);

                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },

        addresses: {
            type: new GraphQLList(ContactAddressType),
            resolve: async (contact: Contact, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            contacts_address_data
                        WHERE
                            contact_id = :contact_id AND
                            connected_account_id = :connected_account_id
                    `, {
                        contact_id: contact.contact_id,
                        connected_account_id: contact.connected_account_id
                    });

                    for (const row of result.rows)
                        if (row.data && typeof row.data === 'string')
                            row.data = JSON.parse(row.data);

                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },

        custom_fields: {
            type: new GraphQLList(ContactCustomFieldType),
            resolve: async (contact: Contact, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            contacts_custom_field
                        WHERE
                            contact_id = :contact_id AND
                            connected_account_id = :connected_account_id
                    `, {
                        contact_id: contact.contact_id,
                        connected_account_id: contact.connected_account_id
                    });


                    for (const row of result.rows)
                        if (row.data && typeof row.data === 'string')
                            row.data = JSON.parse(row.data);

                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },

        emails: {
            type: new GraphQLList(ContactEmailType),
            resolve: async (contact: Contact, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            contacts_email_data
                        WHERE
                            contact_id = :contact_id AND
                            connected_account_id = :connected_account_id
                    `, {
                        contact_id: contact.contact_id,
                        connected_account_id: contact.connected_account_id
                    });

                    for (const row of result.rows)
                        if (row.data && typeof row.data === 'string')
                            row.data = JSON.parse(row.data);

                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },

        phones: {
            type: new GraphQLList(ContactPhoneType),
            resolve: async (contact: Contact, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            contacts_phone_data
                        WHERE
                            contact_id = :contact_id AND
                            connected_account_id = :connected_account_id
                    `, {
                        contact_id: contact.contact_id,
                        connected_account_id: contact.connected_account_id,
                    });


                    for (const row of result.rows)
                        if (row.data && typeof row.data === 'string')
                            row.data = JSON.parse(row.data);

                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        }

    })

});



export { ContactType };
