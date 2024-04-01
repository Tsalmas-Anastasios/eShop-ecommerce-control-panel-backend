import { Request } from 'express';
import { utils } from '../lib/utils.service';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';



class ShopDetailsRandomData {

    async getShopLogoUrl(account_id: string): Promise<string> {

        try {

            const result = await mysql.query(`
                SELECT
                    shop_logo
                FROM
                    companies
                WHERE
                    connected_account_id = :account_id
            `, {
                account_id: account_id,
            });


            if (result.rowsCount === 0)
                return Promise.resolve(null);

            return Promise.resolve(result.rows[0]);

        } catch (error) {
            return Promise.reject(error);
        }

    }


    async getShopUrl(account_id: string): Promise<string> {

        try {

            const result = await mysql.query(`
                SELECT
                    shop_url
                FROM
                    companies
                WHERE
                    connected_account_id = :account_id
            `, {
                account_id: account_id
            });

            if (result.rowsCount === 0)
                return Promise.resolve(null);

            return Promise.resolve(result.rows[0]);

        } catch (error) {
            return Promise.reject(error);
        }

    }


    async getShopName(account_id: string): Promise<string> {

        try {

            const result = await mysql.query(`
                SELECT
                    shop_name
                FROM
                    companies
                WHERE
                    connected_account_id = :account_id
            `, {
                account_id: account_id,
            });

            if (result.rowsCount === 0)
                return Promise.resolve(null);

            return Promise.resolve(result.rows[0]);

        } catch (error) {
            return Promise.reject(error);
        }

    }

}



class ShopDetailsSocialLinks {

    async getShopGoogleRateUrl(account_id: string): Promise<string> {

        try {

            const result = await mysql.query(`
                SELECT
                    shop_google_rate_url
                FROM
                    companies
                WHERE
                    connected_account_id = :account_id
            `, {
                account_id: account_id,
            });


            if (result.rowsCount === 0)
                return Promise.resolve(null);

            return Promise.resolve(result.rows[0]);

        } catch (error) {
            return Promise.reject(error);
        }

    }

}


const shopDetailsRandomData = new ShopDetailsRandomData();
const shopDetailsSocialLinks = new ShopDetailsSocialLinks();
export { shopDetailsRandomData, shopDetailsSocialLinks };
