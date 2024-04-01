import { GraphQlSearchProductsParamsArgs } from './../../models/Products';
import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, graphqlSync } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';

import { ProductInventoryProductWarehouseRunwaysData } from '../../models';

import { ProductInventoryProductWarehouseColumnType } from './ProductInventoryProductWarehouseColumnType';




// tslint:disable-next-line:variable-name
const ProductInventoryProductWarehouseRunwayType = new GraphQLObjectType({
    name: 'ProductInventoryProductWarehouseRunwayType',
    fields: () => ({

        rec_id: { type: GraphQLString },
        inventory_id: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },
        rec_product_id: { type: GraphQLString },
        rec_warehouse_id: { type: GraphQLString },
        runway_id: { type: GraphQLString },
        runway_name: { type: GraphQLString },
        runway_code: { type: GraphQLString },
        runway_total_stock: { type: GraphQLInt },


        columns: {
            type: new GraphQLList(ProductInventoryProductWarehouseColumnType),
            resolve: async (runway: ProductInventoryProductWarehouseRunwaysData, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            product_inventories_products_warehouses_columns
                        WHERE
                            inventory_id = :inventory_id AND
                            connected_account_id = :connected_account_id AND
                            rec_product_id = :rec_product_id AND
                            rec_warehouse_id = :rec_warehouse_id AND
                            rec_runway_id = :rec_runway_id
                    `, {
                        inventory_id: runway.inventory_id,
                        connected_account_id: runway.connected_account_id,
                        rec_product_id: runway.rec_product_id,
                        rec_warehouse_id: runway.rec_warehouse_id,
                        rec_runway_id: runway.rec_id,
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

export { ProductInventoryProductWarehouseRunwayType };
