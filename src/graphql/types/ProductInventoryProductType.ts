import { GraphQlSearchProductsParamsArgs } from './../../models/Products';
import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, graphqlSync } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';

import { ProductInventoryProductData } from '../../models';

import { ProductInventoryProductWarehouseType } from './ProductInventoryProductWarehouseType';




// tslint:disable-next-line:variable-name
const ProductInventoryProductType = new GraphQLObjectType({
    name: 'ProductInventoryProductType',
    fields: () => ({

        rec_product_id: { type: GraphQLString },
        inventory_id: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },
        product_id: { type: GraphQLString },
        product_headline: { type: GraphQLString },
        product_brand: { type: GraphQLString },
        product_model: { type: GraphQLString },
        product_code: { type: GraphQLString },
        inventory_product_stock: { type: GraphQLInt },


        warehouses: {
            type: new GraphQLList(ProductInventoryProductWarehouseType),
            resolve: async (product: ProductInventoryProductData, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            product_inventories_products_warehouses
                        WHERE
                            inventory_id = :inventory_id AND
                            connected_account_id = :connected_account_id AND
                            rec_product_id = :rec_product_id;
                    `, {
                        inventory_id: product.inventory_id,
                        connected_account_id: product.connected_account_id,
                        rec_product_id: product.rec_product_id
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

    })
});

export { ProductInventoryProductType };
