import { GraphQlSearchProductsParamsArgs } from './../../models/Products';
import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, graphqlSync } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';

import { ProductInventoriesSettingsAutoGenerationTimeline, ProductsInventoriesSettings } from '../../models';

import { ProductInventorySettingsAutoGenerationTimelineType } from './ProductInventorySettingsAutoGenerationTimelineType';




// tslint:disable-next-line:variable-name
const ProductInventorySettingsType = new GraphQLObjectType({
    name: 'ProductInventorySettingsType',
    fields: () => ({


        auto_generation_timeline: {
            type: ProductInventorySettingsAutoGenerationTimelineType,
            resolve: async (settings: ProductsInventoriesSettings, args, context, info) => {

                try {


                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            product_inventories_settings
                        WHERE
                            connected_account_id = :connected_account_id AND
                            type = 'auto_generation_timeline';
                    `, {
                        connected_account_id: settings.connected_account_id
                    });




                    if (result.rowsCount > 0) {
                        for (const row of result.rows)
                            if (row.data && typeof row.data === 'string')
                                row.data = JSON.parse(row.data);

                        return result.rows[0];
                    } else
                        return null;

                } catch (error) {
                    return [];
                }

            }
        }


    })
});

export { ProductInventorySettingsType };
