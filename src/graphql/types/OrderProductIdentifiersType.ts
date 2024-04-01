import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { ProductType } from './ProductType';
import { mysql } from '../../lib/connectors/mysql';

import { OrderProductIdentifiers } from '../../models';




// tslint:disable-next-line:variable-name
const OrderProductIdentifiersType = new GraphQLObjectType({

    name: 'OrderProductIdentifiersType',
    fields: () => ({

        rec_id: { type: GraphQLString },
        product_id: { type: GraphQLString },
        order_id: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },
        active: { type: GraphQLBoolean },
        archived: { type: GraphQLBoolean },
        quantity: { type: GraphQLInt },
        supplied_customer_price: { type: GraphQLFloat },
        discount: { type: GraphQLFloat },
        discount_percent: { type: GraphQLFloat },
        fees: { type: GraphQLFloat },
        fee_percent: { type: GraphQLFloat },
        created_at: { type: GraphQLString },

        // product details
        product_details: {
            type: ProductType,
            resolve: async (order_product: OrderProductIdentifiers, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            products
                        WHERE
                            product_id = :product_id AND
                            connected_account_id = :connected_account_id
                    `, {
                        product_id: order_product.product_id,
                        connected_account_id: order_product.connected_account_id
                    });


                    for (const row of result.rows)
                        if (row.data && typeof row.data === 'string')
                            row.data = JSON.parse(row.data);


                    return result.rows[0];

                } catch (error) {
                    return [];
                }

            }
        }

    })

});


export { OrderProductIdentifiersType };
