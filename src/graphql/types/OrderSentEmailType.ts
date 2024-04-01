import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';
import { Product, OrderSentMailDataProduct } from '../../models';
import { ProductImagesType } from './ProductImagesType';



// tslint:disable-next-line:variable-name
const OrderSentEmailType = new GraphQLObjectType({

    name: 'OrderSentEmailType',
    fields: () => ({

        product_id: { type: GraphQLString },
        quantity: { type: GraphQLInt },
        supplied_customer_price: { type: GraphQLInt },
        connected_account_id: { type: GraphQLString },

        product_info: {
            type: new GraphQLList(GraphQLJSONObject),
            resolve: async (data: { product_id: string, connected_account_id: string }, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            headline as headline,
                            product_brand as product_brand,
                            product_model as product_model,
                            product_code as product_code
                        FROM
                            products
                        WHERE
                            product_id = :product_id AND
                            connected_account_id = :connected_account_id
                    `, {
                        product_id: data.product_id,
                        connected_account_id: data.connected_account_id,
                    });


                    if (result.rows.length === 0)
                        return null;


                    return JSON.parse(result.rows[0].data);

                } catch (error) {
                    return [];
                }

            }
        },

        images: {
            type: new GraphQLList(ProductImagesType),
            resolve: async (product: OrderSentMailDataProduct, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            product_images_storage
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

export { OrderSentEmailType };
