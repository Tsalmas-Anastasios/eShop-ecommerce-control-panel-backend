import { GraphQlSearchProductsParamsArgs } from './../../models/Products';
import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, graphqlSync } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';

import { ProductInventoryMainData } from '../../models';

import { ProductInventoryProductType } from './ProductInventoryProductType';




// tslint:disable-next-line:variable-name
const ProductInventoryType = new GraphQLObjectType({
    name: 'ProductInventoryType',
    fields: () => ({

        inventory_id: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },
        descriptive_title: { type: GraphQLString },
        created_at: { type: GraphQLString },
        created_by__user_id: { type: GraphQLString },
        created_by__first_name: { type: GraphQLString },
        created_by__last_name: { type: GraphQLString },


        // inventory products
        products: {
            type: new GraphQLList(ProductInventoryProductType),
            resolve: async (inventory: ProductInventoryMainData, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            product_inventories_products
                        WHERE
                            inventory_id = :inventory_id AND
                            connected_account_id = :connected_account_id;
                    `, {
                        inventory_id: inventory.inventory_id,
                        connected_account_id: inventory.connected_account_id,
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

export { ProductInventoryType };
