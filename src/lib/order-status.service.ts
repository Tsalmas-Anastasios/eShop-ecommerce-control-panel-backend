import { Request } from 'express';
import { utils } from './utils.service';
import { QueryResult, mysql } from './connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';
import { orderIDNumbersGenerator } from './id_numbers_generators/orders';


class UpdateOrder {

    async updateOrder(order_id: string, account_id: string, status: string): Promise<Date> {

        try {

            const date: Date = new Date();

            const result = await mysql.query(`
                UPDATE
                    orders
                SET
                    ${status} = 1,
                    ${status !== 'confirmed' ? status : 'confirm'}_date = :changed_date,
                    current_status = :current_status
                WHERE
                    order_id = :order_id AND
                    connected_account_id = :connected_account_id;
            `, {
                changed_date: date,
                current_status: status,
                order_id: order_id,
                connected_account_id: account_id,
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async archiveOrder(order_id: string, account_id: string): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    orders
                SET
                    archived = 1,
                    current_status = 'archived',
                    archived_date = :date
                WHERE
                    order_id = :order_id,
                    connected_account_id = :connected_account_id;
            `, {
                date: new Date(),
                order_id: order_id,
                connected_account_id: account_id,
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }





    async returnOrder(order_id: string, account_id: string): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    orders
                SET
                    returned = 1,
                    current_status = 'returned',
                    returned_date = :date
                WHERE
                    order_id = :order_id,
                    connected_account_id = :connected_account_id;
            `, {
                date: new Date(),
                order_id: order_id,
                connected_account_id: account_id,
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }

}



class GetOrderStatusService {


    async getStatus(order_id: string, connected_account_id: string): Promise<string> {

        try {

            const result = await mysql.query(`
                SELECT
                    current_status
                FROM
                    orders
                WHERE
                    order_id = :order_id AND
                    connected_account_id = :connected_account_id;
            `, {
                order_id: order_id,
                connected_account_id: connected_account_id
            });


            if (result.rowsCount === 0)
                return Promise.resolve(null);


            return Promise.resolve(result.rows[0].current_status.toString());

        } catch (error) {
            return Promise.reject(error);
        }

    }


}



const updateOrder = new UpdateOrder();
const getOrderStatusService = new GetOrderStatusService();
export { updateOrder, getOrderStatusService };
