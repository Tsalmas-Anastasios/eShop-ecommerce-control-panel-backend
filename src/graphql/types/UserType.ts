import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';
import { User } from '../../models';

import { SessionUserType } from './UserSessionType';
import { CompanyDataType } from './CompanyDataType';
import { UserPrivilegeType } from './UserPrivilegeType';



// tslint:disable-next-line:variable-name
const UserType = new GraphQLObjectType({

    name: 'UserType',
    fields: () => ({

        id: { type: GraphQLString },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        email: { type: GraphQLString },
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        phone: { type: GraphQLString },
        profile_picture_url: { type: GraphQLString },
        activated: { type: GraphQLBoolean },
        request_password_change: { type: GraphQLBoolean },
        created_at: { type: GraphQLString },
        connected_account: { type: GraphQLString },
        is_account: { type: GraphQLBoolean },
        role: { type: GraphQLString },
        role_name: {
            type: GraphQLString,
            resolve: async (user: User, args, context, info) => {

                try {

                    const result = await mysql.query(`SELECT role_name FROM user_roles WHERE role_id = :role_id`, { role_id: user.role });

                    if (result.rowsCount === 0)
                        return null;


                    return result.rows[0].role_name.toString();

                } catch (error) {
                    return [];
                }

            }
        },

        authentication_2fa__app: { type: GraphQLBoolean },
        authentication_2fa__email: { type: GraphQLString },
        authentication_2fa__app_secret: { type: GraphQLString },

        sessions: {
            type: new GraphQLList(SessionUserType),
            resolve: async (user: User, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            sessions
                        WHERE
                            data LIKE '%%"user_id":"${user.id}"%%'
                    `);

                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },

        company_data: {
            type: new GraphQLList(CompanyDataType),
            resolve: async (user: User, args, context, info) => {

                try {

                    const result = await mysql.query(`SELECT * FROM companies WHERE connected_account_id = :connected_account_id`, { connected_account_id: user.connected_account });


                    for (const row of result.rows)
                        if (row.data && typeof row.data === 'string')
                            row.data = JSON.parse(row.data);

                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },

        privileges: {
            type: new GraphQLList(UserPrivilegeType),
            resolve: async (user: User, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            user_privileges
                        WHERE
                            user_id = :user_id AND
                            connected_account_id = :connected_account_id
                    `, {
                        user_id: user.id,
                        connected_account_id: user.connected_account
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

export { UserType };
