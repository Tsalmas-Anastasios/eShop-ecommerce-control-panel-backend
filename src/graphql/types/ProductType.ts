import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';
import { Product } from '../../models';
import { ProductImagesType } from '../types/ProductImagesType';
import { ProductSpecificationCategoryType } from './ProductSpecificationCategoryType';
import { ProductStockType } from './ProductStockType';



// tslint:disable-next-line:variable-name
const ProductType = new GraphQLObjectType({

    name: 'ProductType',
    fields: () => ({

        product_id: { type: GraphQLString },
        headline: { type: GraphQLString },
        product_brand: { type: GraphQLString },
        categories_belongs: { type: GraphQLString },
        product_code: { type: GraphQLString },
        product_model: { type: GraphQLString },
        stock: { type: GraphQLInt },
        supplied_price: { type: GraphQLFloat },
        clear_price: { type: GraphQLFloat },
        fee_percent: { type: GraphQLFloat },
        fees: { type: GraphQLFloat },
        discount_percent: { type: GraphQLFloat },
        discount: { type: GraphQLFloat },

        specification: {
            type: new GraphQLList(ProductSpecificationCategoryType),
            resolve: async (product: Product, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            products_specification_categories
                        WHERE
                            product_id = :product_id AND
                            connected_account_id = :connected_account_id AND
                            product_version = :product_version
                    `, {
                        product_id: product.product_id,
                        connected_account_id: product.connected_account_id,
                        product_version: product.current_version,
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

        product_description: { type: GraphQLString },
        supplier: { type: GraphQLString },
        current_status: { type: GraphQLString },
        archived: { type: GraphQLBoolean },
        notes: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },
        created_at_epoch: { type: GraphQLFloat },
        created_at: { type: GraphQLDateTime },
        current_version: { type: GraphQLString },
        product_shared: { type: GraphQLBoolean },

        images: {
            type: new GraphQLList(ProductImagesType),
            resolve: async (product: Product, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            product_images_storage
                        WHERE
                            product_id = :product_id AND
                            connected_account_id = :connected_account_id AND
                            product_version = :product_version
                    `, {
                        product_id: product.product_id,
                        connected_account_id: product.connected_account_id,
                        product_version: product.current_version
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

        product_stock: {
            type: new GraphQLList(ProductStockType),
            resolve: async (product: Product, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            products_stock_warehouses
                        WHERE
                            product_id = :product_id AND
                            connected_account_id = :connected_account_id
                    `, {
                        product_id: product.product_id,
                        connected_account_id: product.connected_account_id,
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

export { ProductType };
