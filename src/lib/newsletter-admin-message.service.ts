import { Request } from 'express';
import {
    NewsletterHistoryMessages, CompanyEmailData, NewsletterHistoryMessagesSearchParamsDataArgsGraphQL
} from '../models';
import { utils } from '../lib/utils.service';
import { mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';
import * as jwt from 'jsonwebtoken';

import { newsletterIDGenerators } from './id_numbers_generators/newsletter';





class AddMessageHistoryService {


    async addMessage(data: NewsletterHistoryMessages): Promise<string> {

        try {

            const rec_id = newsletterIDGenerators.messageID();
            const result = await mysql.query(`
                INSERT INTO
                    newsletter_history
                SET
                    message_id = :message_id,
                    connected_account_id = :connected_account_id,
                    subject = :subject,
                    message = :message,
                    status = :status
            `, {
                message_id: rec_id,
                connected_account_id: data.connected_account_id,
                subject: data.subject,
                message: data.message,
                status: data.status,
            });


            return Promise.resolve(rec_id);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class FindCompanyMailDataService {


    async getCompanyEmailData(params?: { email_id?: string, connected_account_id: string }, req?: Request): Promise<CompanyEmailData[]> {

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
                        companyEmails${graphQueryParams !== '()' ? graphQueryParams : ''}{
                            email_id
                            email_label
                            host
                            port
                            secure
                            user
                            password
                            default_name
                            default_email
                        }
                    }
                `,
                contextValue: req || null,
            });


            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });


            const email_list: CompanyEmailData[] = result.data.companyEmails as CompanyEmailData[];
            return Promise.resolve(email_list);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async getSpecificEmail(params: { email_id: string, connected_account_id: string }, req?: Request): Promise<CompanyEmailData> {

        try {

            const email_list: CompanyEmailData[] = await this.getCompanyEmailData(params, req || null);
            if (email_list.length === 0)
                return Promise.resolve(null);

            return Promise.resolve(email_list[0] as CompanyEmailData);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class MessageHistoryCheckerService {


    async messageExists(message_id: string, connected_account_id: string): Promise<boolean> {

        try {

            const result = await mysql.query(`
                SELECT
                    message_id
                FROM
                    newsletter_history
                WHERE
                    message_id = :message_id AND
                    connected_account_id = :connected_account_id
            `, {
                message_id: message_id,
                connected_account_id: connected_account_id
            });


            if (result.rowsCount === 0)
                return Promise.resolve(false);

            return Promise.resolve(true);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class MessageHistoryUpdateMessageService {



    async updateSentDateMessage(message_id: string, connected_account_id: string): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    newsletter_history
                SET
                    sent_at = :new_date_for_send
                WHERE
                    message_id = :message_id AND
                    connected_account_id = :connected_account_id
            `, {
                new_date_for_send: new Date(),
                message_id: message_id,
                connected_account_id: connected_account_id
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async updateMessage(data: NewsletterHistoryMessages): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    newsletter_history
                SET
                    ${data?.subject && data?.subject !== null ? `subject = '${data.subject}',` : ``}
                    ${data?.message && data?.message !== null ? `message = '${data.message}',` : ``}
                    status = :status
                WHERE
                    message_id = :message_id AND
                    connected_account_id = :connected_account_id
            `, {
                status: data.status,
                message_id: data.message_id,
                connected_account_id: data.connected_account_id
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class MessageHistoryDeleteService {


    async deleteMessage(data: { message_id: string, connected_account_id: string }): Promise<void> {

        try {

            // const result = await mysql.query(`
            //     DELETE FROM
            //         newsletter_history
            //     WHERE
            //         message_id = :message_id AND
            //         connected_account_id = :connected_account_id
            // `, {
            //     message_id: data.message_id,
            //     connected_account_id: data.connected_account_id
            // });


            const result = await mysql.query(`
                UPDATE
                    newsletter_history
                SET
                    status = 'archived'
                WHERE
                    message_id = :message_id AND
                    connected_account_id = :connected_account_id
            `, {
                message_id: data.message_id,
                connected_account_id: data.connected_account_id
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }


}





class MessageHistoryGetMessagesService {


    async getMessagesList(params?: NewsletterHistoryMessagesSearchParamsDataArgsGraphQL, req?: Request): Promise<NewsletterHistoryMessages[]> {

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
                        newsletterMessages${graphQueryParams !== '()' ? graphQueryParams : ''}{
                            message_id
                            connected_account_id
                            subject
                            status
                            created_at
                            last_update_date
                            sent_at

                            emails{
                                email_id
                                email
                            }
                        }
                    }
                `,
                contextValue: req || null,
            });

            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });


            const messages: NewsletterHistoryMessages[] = result.data.newsletterMessages as NewsletterHistoryMessages[];

            return Promise.resolve(messages);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async getSpecificMessage(params: NewsletterHistoryMessagesSearchParamsDataArgsGraphQL, req?: Request): Promise<NewsletterHistoryMessages> {

        try {

            const messages: NewsletterHistoryMessages[] = await this.getMessagesList(params, req || null);
            if (messages.length === 0)
                return Promise.resolve(null);

            return Promise.resolve(messages[0] as NewsletterHistoryMessages);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}









const addMessageHistoryService = new AddMessageHistoryService();
const findCompanyMailDataService = new FindCompanyMailDataService();
const messageHistoryCheckerService = new MessageHistoryCheckerService();
const messageHistoryUpdateMessageService = new MessageHistoryUpdateMessageService();
const messageHistoryDeleteService = new MessageHistoryDeleteService();
const messageHistoryGetMessagesService = new MessageHistoryGetMessagesService();
export {
    addMessageHistoryService, findCompanyMailDataService, messageHistoryCheckerService, messageHistoryUpdateMessageService,
    messageHistoryDeleteService, messageHistoryGetMessagesService
};
