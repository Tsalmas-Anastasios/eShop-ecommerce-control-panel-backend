import { Request } from 'express';
import { utils } from '../lib/utils.service';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { config } from '../config';

import { productsIDNumbersGenerator } from './id_numbers_generators/products';




class UpdateProductStatusService {


    async updateProductStatus(identifiers: { product_id: string, connected_account_id: string }, status: string): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    products
                SET
                    current_status = :status
                WHERE
                    product_id = :product_id AND
                    connected_account_id = :connected_account_id
            `, {
                status: status,
                product_id: identifiers.product_id,
                connected_account_id: identifiers.connected_account_id,
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async getVersionId(identifiers: { product_id: string, connected_account_id: string }): Promise<string> {

        try {

            const result = await mysql.query(`
                SELECT
                    current_version
                FROM
                    products
                WHERE
                    product_id = :product_id AND
                    connected_account_id = :connected_account_id
            `, {
                product_id: identifiers.product_id,
                connected_account_id: identifiers.connected_account_id,
            });


            if (result.rowsCount === 0)
                return Promise.resolve(null);

            return Promise.resolve(result.rows[0].version as string);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async updateStatusOnHistory(identifiers: { version_id: string, product_id: string, connected_account_id: string }, status: string): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    products_update_history
                SET
                    current_status = :current_status
                WHERE
                    rec_id = :rec_id AND
                    product_id = :product_id AND
                    connected_account_id = :connected_account_id
            `, {
                current_status: status,
                rec_id: identifiers.version_id,
                product_id: identifiers.product_id,
                connected_account_id: identifiers.connected_account_id,
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class ArchiveProductService {


    async archiveProduct(identifiers: { product_id: string, connected_account_id: string }): Promise<string> {

        try {
            const version_id = productsIDNumbersGenerator.getNewHistoryProductID();
            const result = await mysql.query(`
                UPDATE
                    products
                SET
                    archive = 1,
                    version = :version
                WHERE
                    product_id = :product_id AND
                    connected_account_id = :connected_account_id
            `, {
                version: version_id,
                product_id: identifiers.product_id,
                connected_account_id: identifiers.connected_account_id,
            });


            return Promise.resolve(version_id);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




const updateProductStatusService = new UpdateProductStatusService();
const archiveProductService = new ArchiveProductService();
export { updateProductStatusService, archiveProductService };
