import { Contact, ContactLabel, ContactLabelName, ContactAddressData, ContactCustomFields, ContactPhoneData, ContactEmailData } from '../../models';
import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';



// tslint:disable-next-line:variable-name
const ContactLabelType = new GraphQLObjectType({

    name: 'ContactLabelType',
    fields: () => ({

        rec_id: { type: GraphQLString },
        label_id: { type: GraphQLString },
        label: {
            type: GraphQLString,
            resolve: async (contactLabel: ContactLabel, args, context, info) => {
                try {

                    const result = await mysql.query(`
                        SELECT
                            label
                        FROM
                            contact_labels_names
                        WHERE
                            label_id = :label_id AND
                            connected_account_id = :connected_account_id
                    `, {
                        label_id: contactLabel.label_id,
                        connected_account_id: contactLabel.connected_account_id
                    });


                    if (result.rowsCount === 0)
                        return null;


                    return result.rows[0].label as string;

                } catch (error) {
                    return [];
                }
            }
        },
        connected_account_id: { type: GraphQLString },
        contact_id: { type: GraphQLString },

    })

});

export { ContactLabelType };
