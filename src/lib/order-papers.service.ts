import { Request } from 'express';
import { utils } from '../lib/utils.service';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';

import { orderIDNumbersGenerator } from './id_numbers_generators/orders';

import * as dotenv from 'dotenv';



class SaveNewOrderPaperService {

    async saveNewOrderPaper(data: {
        filename: string,
        order_id: string,
        type: string,
        connected_account_id: string,
    }): Promise<string> {

        try {

            const new_paper_id = orderIDNumbersGenerator.getNewOrderPaperID();
            const result = await mysql.query(`
                INSERT INTO
                    order_papers
                SET
                    id = :id,
                    url = :url,
                    order_id = :order_id,
                    type = :type,
                    archived = :archived,
                    connected_account_id = :connected_account_id;
            `, {
                id: new_paper_id,
                url: `${process.env.ORDER_PAPERS_STORAGE_FOLDER}${data.filename}`,
                order_id: data.order_id,
                type: data.type,
                connected_account_id: data.connected_account_id
            });

            return Promise.resolve(new_paper_id);

        } catch (error) {
            return Promise.reject(error);
        }

    }

}






class DeleteOrderPaperService {

    async deleteOrderPaper(order_paper_id: string, connected_account_id: string): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    order_papers
                SET
                    archived = 1
                WHERE
                    id = :id AND
                    connected_account_id = :connected_account_id
            `, {
                id: order_paper_id,
                connected_account_id: connected_account_id
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }

}


const saveNewOrderPaperService = new SaveNewOrderPaperService();
const deleteOrderPaperService = new DeleteOrderPaperService();
export { saveNewOrderPaperService, deleteOrderPaperService };
