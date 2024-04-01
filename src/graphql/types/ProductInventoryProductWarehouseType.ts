import { GraphQlSearchProductsParamsArgs } from './../../models/Products';
import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, graphqlSync } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';

import { ProductInventoryProductWarehouseData } from '../../models';

import { ProductInventoryProductWarehouseRunwayType } from './ProductInventoryProductWarehouseRunwayType';




// tslint:disable-next-line:variable-name
const ProductInventoryProductWarehouseType = new GraphQLObjectType({
    name: 'ProductInventoryProductWarehouseType',
    fields: () => ({

        rec_id: { type: GraphQLString },
        inventory_id: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },
        rec_product_id: { type: GraphQLString },
        warehouse_id: { type: GraphQLString },
        warehouse_distinctive_title: { type: GraphQLString },
        warehouse_code_name: { type: GraphQLString },
        warehouse_total_stock: { type: GraphQLInt },


        runways: {
            type: new GraphQLList(ProductInventoryProductWarehouseRunwayType),
            resolve: async (warehouse: ProductInventoryProductWarehouseData, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            product_inventories_products_warehouses_runways
                        WHERE
                            inventory_id = :inventory_id AND
                            connected_account_id = :connected_account_id AND
                            rec_product_id = :rec_product_id AND
                            rec_warehouse_id = :rec_warehouse_id;
                    `, {
                        inventory_id: warehouse.inventory_id,
                        connected_account_id: warehouse.connected_account_id,
                        rec_product_id: warehouse.rec_product_id,
                        rec_warehouse_id: warehouse.rec_id
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

export { ProductInventoryProductWarehouseType };
