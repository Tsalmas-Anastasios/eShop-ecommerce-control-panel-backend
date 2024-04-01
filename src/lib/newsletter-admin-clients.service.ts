import { Request } from 'express';
import {
    NewsletterHistoryMessages, NewsletterClientEmailSearchParamsArgsData, NewsletterClientEmailData
} from '../models';
import { utils } from './utils.service';
import { mysql } from './connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';
import * as jwt from 'jsonwebtoken';

import { newsletterIDGenerators } from './id_numbers_generators/newsletter';





class NewsletterClientsEmailsListService {


    async getClientsEmailsList(params?: NewsletterClientEmailSearchParamsArgsData, req?: Request): Promise<NewsletterClientEmailData[]> {

        try {

            let graphQueryParams = '';

            if (params && !utils.lodash.isEmpty(params)) {

                graphQueryParams += '(';

                // tslint:disable-next-line:curly
                let i = 0;
                for (const key in params) {
                    if (i > 0)
                        graphQueryParams += ',';

                    if (typeof params[key] === 'number')
                        graphQueryParams += `${key}: ${params[key]}`;
                    else
                        graphQueryParams += `${key}: "${params[key]}"`;

                    i++;

                }

                graphQueryParams += ')';

            }



            const result = await graphql({
                schema: schema,
                source: `
                    {
                        newsletterClientsEmails${graphQueryParams !== '()' ? graphQueryParams : ''}{
                            client_email
                        }
                    }
                `,
                contextValue: req || null,
            });

            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });



            const emails_list: NewsletterClientEmailData[] = result.data.newsletterClientsEmails as NewsletterClientEmailData[];
            return Promise.resolve(emails_list);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}



class NewsletterClientsEmailAddService {


    async addNewEmail(data: NewsletterClientEmailData): Promise<void> {

        try {

            const result = await mysql.query(`
                INSERT INTO
                    newsletter_clients_email
                SET
                    rec_id = :rec_id,
                    client_email = :client_email,
                    ${data?.client_name && data?.client_name !== null ? `client_name = '${data.client_name}',` : ``}
                    connected_account_id = :connected_account_id
            `, {
                rec_id: newsletterIDGenerators.clientEmailID(),
                client_email: data.client_email,
                connected_account_id: data.connected_account_id
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class NewsletterClientsEmailDeleteService {


    async deleteClientEmail(data: { rec_id: string, connected_account_id: string }): Promise<void> {

        try {

            const result = await mysql.query(`
                DELETE FROM
                    newsletter_clients_email
                WHERE
                    rec_id = :rec_id AND
                    connected_account_id = :connected_account_id
            `, {
                rec_id: data.rec_id,
                connected_account_id: data.connected_account_id
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class NewsletterClientsEmailCheckerService {


    async emailExists(data: { rec_id: string, connected_account_id: string }): Promise<boolean> {

        try {

            const result = await mysql.query(`
                SELECT
                    rec_id
                FROM
                    newsletter_clients_email
                WHERE
                    rec_id = :rec_id AND
                    connected_account_id = :connected_account_id
            `, {
                rec_id: data.rec_id,
                connected_account_id: data.connected_account_id
            });


            if (result.rowsCount === 0)
                return Promise.resolve(false);

            return Promise.resolve(true);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}








const newsletterClientsEmailsListService = new NewsletterClientsEmailsListService();
const newsletterClientsEmailAddService = new NewsletterClientsEmailAddService();
const newsletterClientsEmailDeleteService = new NewsletterClientsEmailDeleteService();
const newsletterClientsEmailCheckerService = new NewsletterClientsEmailCheckerService();
export {
    newsletterClientsEmailsListService, newsletterClientsEmailAddService,
    newsletterClientsEmailDeleteService, newsletterClientsEmailCheckerService
};
