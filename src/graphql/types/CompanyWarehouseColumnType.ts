import { GraphQlSearchProductsParamsArgs } from '../../models/Products';
import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, graphqlSync } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';
import { CompanyWarehouseColumnShelf } from '../../models';

import { CompanyWarehouseColumnShelfType } from './CompanyWarehouseColumnShelfType';




// tslint:disable-next-line:variable-name
const CompanyWarehouseColumnType = new GraphQLObjectType({
    name: 'CompanyWarehouseColumnType',
    fields: () => ({

        column_id: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },
        warehouse_id: { type: GraphQLString },
        runway_id: { type: GraphQLString },
        column_name: { type: GraphQLString },
        column_code: { type: GraphQLString },

        shelf: {
            type: new GraphQLList(CompanyWarehouseColumnShelfType),
            resolve: async (column: CompanyWarehouseColumnShelf, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            company_warehouses__column_shelfs
                        WHERE
                            connected_account_id = :connected_account_id AND
                            warehouse_id = :warehouse_id AND
                            runway_id = :runway_id AND
                            column_id = :column_id
                    `, column);


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

export { CompanyWarehouseColumnType };
