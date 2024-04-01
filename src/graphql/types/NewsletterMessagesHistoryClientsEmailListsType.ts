import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, graphqlSync } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';

import { NewsletterMessagesHistoryClientsEmailLists } from '../../models';




// tslint:disable-next-line:variable-name
const NewsletterMessagesHistoryClientsEmailListsType = new GraphQLObjectType({

    name: 'NewsletterMessagesHistoryClientsEmailListsType',
    fields: () => ({

        rec_id: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },
        message_id: { type: GraphQLString },
        email_id: { type: GraphQLString },
        email: {
            type: GraphQLString,
            resolve: async (email: NewsletterMessagesHistoryClientsEmailLists, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            client_email
                        FROM
                            newsletter_clients_email
                        WHERE
                            rec_id = :rec_id
                    `, {
                        rec_id: email.email_id
                    });


                    if (result.rowsCount === 0)
                        return null;

                    return result.rows[0].client_email as string;

                } catch (error) {
                    return [];
                }

            }
        }

    })

});



export { NewsletterMessagesHistoryClientsEmailListsType };
