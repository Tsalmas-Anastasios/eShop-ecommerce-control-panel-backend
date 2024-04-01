import { Request } from 'express';
import { utils } from '../lib/utils.service';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';



class UpdateProduct {

    async archiveProduct(params: { order_id: string, product_id: string }, account_id: string): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    order_products
                SET
                    active = 0,
                    archive = 1
                WHERE
                    product_id = :product_id AND
                    order_id = :order_id AND
                    connected_account_id = :connected_account_id;
            `, {
                product_id: params.product_id,
                order_id: params.order_id,
                connected_account_id: account_id,
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async activateProduct(params: { order_id: string, product_id: string }, account_id: string): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    order_products
                SET
                    active = 1,
                    archive = 0
                WHERE
                    product_id = :product_id AND
                    order_id = :order_id AND
                    connected_account_id = :connected_account_id;
            `, {
                product_id: params.product_id,
                order_id: params.order_id,
                connected_account_id: account_id,
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }

}



const updateProduct = new UpdateProduct();
export { updateProduct };
