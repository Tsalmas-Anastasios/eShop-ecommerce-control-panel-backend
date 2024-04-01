import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';
import { ProductSpecificationCategory } from '../../models';

import { ProductSpecificationFieldType } from './ProductSpecificationFieldType';





// tslint:disable-next-line:variable-name
const ProductSpecificationCategoryType = new GraphQLObjectType({

    name: 'ProductSpecificationCategoryType',
    fields: () => ({

        id: { type: GraphQLString },
        category_name: { type: GraphQLString },
        product_id: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },

        fields: {
            type: new GraphQLList(ProductSpecificationFieldType),
            resolve: async (product_specification_category: ProductSpecificationCategory, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            products_specification_fields
                        WHERE
                            specification_category_id = :specification_category_id AND
                            product_id = :product_id AND
                            connected_account_id = :connected_account_id AND
                            product_version = :product_version
                    `, {
                        specification_category_id: product_specification_category.id,
                        product_id: product_specification_category.product_id,
                        connected_account_id: product_specification_category.connected_account_id,
                        product_version: product_specification_category.product_version,
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

export { ProductSpecificationCategoryType };

