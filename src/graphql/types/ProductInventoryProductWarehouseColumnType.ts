import { GraphQlSearchProductsParamsArgs } from './../../models/Products';
import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, graphqlSync } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';

import { ProductInventoryProductWarehouseRunwaysColumnsData } from '../../models';

import { ProductInventoryProductWarehouseColumnShelfType } from './ProductInventoryProductWarehouseColumnShelfType';



// tslint:disable-next-line:variable-name
const ProductInventoryProductWarehouseColumnType = new GraphQLObjectType({
    name: 'ProductInventoryProductWarehouseColumnType',
    fields: () => ({

        rec_id: { type: GraphQLString },
        inventory_id: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },
        rec_product_id: { type: GraphQLString },
        rec_warehouse_id: { type: GraphQLString },
        rec_runway_id: { type: GraphQLString },
        column_id: { type: GraphQLString },
        column_name: { type: GraphQLString },
        column_code: { type: GraphQLString },
        column_total_stock: { type: GraphQLInt },


        shelf: {
            type: new GraphQLList(ProductInventoryProductWarehouseColumnShelfType),
            resolve: async (column: ProductInventoryProductWarehouseRunwaysColumnsData, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            product_inventories_products_warehouses_columns_shelf
                        WHERE
                            inventory_id = :inventory_id AND
                            connected_account_id = :connected_account_id AND
                            rec_product_id = :rec_product_id AND
                            rec_warehouse_id = :rec_warehouse_id AND
                            rec_runway_id = :rec_runway_id AND
                            rec_column_id = :rec_column_id
                    `, {
                        inventory_id: column.inventory_id,
                        connected_account_id: column.connected_account_id,
                        rec_product_id: column.rec_product_id,
                        rec_warehouse_id: column.rec_warehouse_id,
                        rec_runway_id: column.rec_runway_id,
                        rec_column_id: column.rec_id
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

export { ProductInventoryProductWarehouseColumnType };
