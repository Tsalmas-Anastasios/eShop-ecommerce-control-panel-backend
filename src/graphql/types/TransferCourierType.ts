import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { mysql } from '../../lib/connectors/mysql';




// tslint:disable-next-line:variable-name
const TransferCourierType = new GraphQLObjectType({

    name: 'TransferCourierType',
    fields: () => ({

        rec_id: { type: GraphQLString },
        name: { type: GraphQLString },

        type: { type: GraphQLString },
        type_details: {
            type: TransferCourierTypeDetailsType,
            resolve: async (courier: any, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            transfer_couriers_types
                        WHERE
                            rec_id = :rec_id
                    `, { rec_id: courier.type });


                    for (const row of result.rows)
                        if (row.data && typeof row.data === 'string')
                            row.data = JSON.parse(row.data);


                    return result.rows[0];

                } catch (error) {
                    return [];
                }

            }
        },

        description: { type: GraphQLString },
        banner_url: { type: GraphQLString },
        main_url: { type: GraphQLString },
        tracking_basic_url: { type: GraphQLString },
        integrated: { type: GraphQLString },

    }),

});




// tslint:disable-next-line:variable-name
const TransferCourierTypeDetailsType = new GraphQLObjectType({

    name: 'TransferCourierTypeDetailsType',
    fields: () => ({

        rec_id: { type: GraphQLString },
        type_description: { type: GraphQLString }

    }),

});



export { TransferCourierType, TransferCourierTypeDetailsType };
