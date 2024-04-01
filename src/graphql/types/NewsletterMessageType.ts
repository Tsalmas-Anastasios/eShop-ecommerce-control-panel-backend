import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, graphqlSync } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';

import { NewsletterHistoryMessages } from '../../models';

import { NewsletterMessagesHistoryClientsEmailListsType } from './NewsletterMessagesHistoryClientsEmailListsType';





// tslint:disable-next-line:variable-name
const NewsletterType = new GraphQLObjectType({

    name: 'NewsletterType',
    fields: () => ({

        message_id: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },
        subject: { type: GraphQLString },
        status: { type: GraphQLString },
        created_at: { type: GraphQLString },
        last_update_date: { type: GraphQLString },
        sent_at: { type: GraphQLString },

        emails: {
            type: new GraphQLList(NewsletterMessagesHistoryClientsEmailListsType),
            resolve: async (newsletterMessage: NewsletterHistoryMessages, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            newsletter_messages_history_clients_email_lists
                        WHERE
                            message_id = :message_id AND
                            connected_account_id = :connected_account_id
                    `, {
                        message_id: newsletterMessage.message_id,
                        connected_account_id: newsletterMessage.connected_account_id
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



export { NewsletterType };
