import { Application, Request, Response, request } from 'express';
import { utils } from '../lib/utils.service';
import { config, emailServer } from '../config';

import { NewsletterHistoryMessages, CompanyEmailData } from '../models';
import {
    addMessageHistoryService, findCompanyMailDataService, messageHistoryCheckerService, messageHistoryUpdateMessageService,
    messageHistoryDeleteService, messageHistoryGetMessagesService
} from '../lib/newsletter-admin-message.service';
import { newsletterClientsEmailsListService } from '../lib/newsletter-admin-clients.service';
import { mailServer } from '../lib/connectors/mailServer';





export class NewsletterManagementAdminRoutes {


    public routes(server: Application) {


        server.route('/api/manage/newsletter/messages/specific-message')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    if (!req.query?.message_id)
                        return utils.errorHandlingReturn({ code: 400, type: 'missing_data', message: 'Missing data from your wrote message' }, res);


                    const data = {
                        message_id: req.query.message_id as string,
                        connected_account_id: utils.findAccountIDFromSessionObject(req)
                    };

                    if (!await messageHistoryCheckerService.messageExists(data.message_id, data.connected_account_id))
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'message_not_found',
                            message: 'Message that you want to edit, not found',
                        }, res);



                    const message: NewsletterHistoryMessages = await messageHistoryGetMessagesService.getSpecificMessage(data, req);


                    return res.status(200).send(message);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            })
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const data: NewsletterHistoryMessages = req.body.message;
                    if (!data?.subject || !data?.message)
                        return utils.errorHandlingReturn({ code: 400, type: 'missing_data', message: 'Missing data from your wrote message' }, res);

                    let action = req.query?.action || 'send';
                    if (action !== 'save_send' && action !== 'save')
                        return utils.errorHandlingReturn({ code: 501, type: 'wrong_action', message: 'Wrong action given' }, res);
                    else
                        action = action === 'save_send' ? 'sent' : 'draft';




                    const connected_account_id = utils.findAccountIDFromSessionObject(req);
                    const message_data: NewsletterHistoryMessages = {
                        connected_account_id: connected_account_id,
                        subject: data.subject,
                        message: data.message,
                        status: action === 'sent' ? 'sent' : 'draft',
                    };



                    const rec_id = await addMessageHistoryService.addMessage(message_data);


                    let email_id: string = null;
                    if (message_data.status === 'sent') {
                        // change sent date
                        await messageHistoryUpdateMessageService.updateSentDateMessage(rec_id, connected_account_id);

                        // send message
                        const emails_list_tmp = await newsletterClientsEmailsListService.getClientsEmailsList({ connected_account_id: connected_account_id }, req);
                        const emails_list: string[] = [];
                        for (let i = 0; i < emails_list_tmp.length; i++)
                            emails_list.push(emails_list_tmp[i].client_email);


                        if (!req.body?.company_email_id)
                            email_id = await mailServer.send_mail({
                                from_name: emailServer.newsletter_email.defaults.name,
                                from_email: emailServer.newsletter_email.defaults.email,
                                from_psswd: emailServer.newsletter_email.defaults.password,
                                to: emails_list,
                                subject: data.subject,
                                html: data.message
                            });
                        else {
                            // send email using company's mail
                            const company_email: CompanyEmailData = await findCompanyMailDataService.getSpecificEmail({
                                email_id: req.body.company_email_id,
                                connected_account_id: connected_account_id
                            }, req);
                            email_id = await mailServer.send_mail({
                                host: company_email.host,
                                port: company_email.port,
                                secure: company_email.secure,
                                from_name: company_email.default_name,
                                from_email: company_email.default_email,
                                from_psswd: company_email.password,
                                to: emails_list,
                                subject: data.subject,
                                html: data.message
                            });
                        }

                    }




                    // response
                    return res.status(200).send({
                        code: 200,
                        type: 'message_saved',
                        message: 'Message saved successfully',
                        action: action,
                        message_id: email_id
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            })
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const data: NewsletterHistoryMessages = req.body.message;
                    if (!data?.message_id)
                        return utils.errorHandlingReturn({ code: 401, type: 'undefined_message', message: 'Undefined message. No message id provided' }, res);

                    if (!data?.subject && !data?.message)
                        return utils.errorHandlingReturn({ code: 400, type: 'missing_data', message: 'Missing data from your wrote message' }, res);

                    let action = req.query?.action || 'send';
                    if (action !== 'save_send' && action !== 'save')
                        return utils.errorHandlingReturn({ code: 501, type: 'wrong_action', message: 'Wrong action given' }, res);
                    else
                        action = action === 'save_send' ? 'sent' : 'draft';




                    const connected_account_id = utils.findAccountIDFromSessionObject(req);
                    const message_data: NewsletterHistoryMessages = {
                        message_id: data.message_id,
                        connected_account_id: connected_account_id,
                        subject: data?.subject || null,
                        message: data?.message || null,
                        status: action === 'sent' ? 'sent' : 'draft',
                    };


                    if (!await messageHistoryCheckerService.messageExists(message_data.message_id, message_data.connected_account_id))
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'message_not_found',
                            message: 'Message that you want to edit, not found',
                        }, res);



                    // update message data
                    await messageHistoryUpdateMessageService.updateMessage(message_data);



                    let email_id: string = null;
                    if (message_data.status === 'sent') {

                        // change sent date
                        await messageHistoryUpdateMessageService.updateSentDateMessage(message_data.message_id, message_data.connected_account_id);

                        // send message
                        const emails_list_tmp = await newsletterClientsEmailsListService.getClientsEmailsList({ connected_account_id: connected_account_id }, req);
                        const emails_list: string[] = [];
                        for (let i = 0; i < emails_list_tmp.length; i++)
                            emails_list.push(emails_list_tmp[i].client_email);


                        if (!req.body?.company_email_id)
                            email_id = await mailServer.send_mail({
                                from_name: emailServer.newsletter_email.defaults.name,
                                from_email: emailServer.newsletter_email.defaults.email,
                                from_psswd: emailServer.newsletter_email.defaults.password,
                                to: emails_list,
                                subject: data.subject,
                                html: data.message
                            });
                        else {
                            // send email using company's mail
                            const company_email: CompanyEmailData = await findCompanyMailDataService.getSpecificEmail({
                                email_id: req.body.company_email_id,
                                connected_account_id: connected_account_id
                            }, req);
                            email_id = await mailServer.send_mail({
                                host: company_email.host,
                                port: company_email.port,
                                secure: company_email.secure,
                                from_name: company_email.default_name,
                                from_email: company_email.default_email,
                                from_psswd: company_email.password,
                                to: emails_list,
                                subject: data.subject,
                                html: data.message
                            });
                        }

                    }





                    return res.status(200).send({
                        code: 200,
                        type: 'message_updated',
                        message: 'Email updated successfully and saved to the cloud service',
                        action: message_data.status,
                        message_id: message_data.message_id
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            })
            .delete(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    if (!req.query?.message_id)
                        return utils.errorHandlingReturn({ code: 400, type: 'missing_data', message: 'Missing data from your wrote message' }, res);


                    const data = {
                        message_id: req.query.message_id as string,
                        connected_account_id: utils.findAccountIDFromSessionObject(req)
                    };

                    if (!await messageHistoryCheckerService.messageExists(data.message_id, data.connected_account_id))
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'message_not_found',
                            message: 'Message that you want to edit, not found',
                        }, res);




                    // delete message
                    await messageHistoryDeleteService.deleteMessage(data);



                    return res.status(200).send({
                        code: 200,
                        type: 'message_deleted',
                        message: 'Message deleted successfully'
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });




        server.route('/api/manage/newsletter/messages/list')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const connected_account_id = utils.findAccountIDFromSessionObject(req);
                    const message_list: NewsletterHistoryMessages[] = await messageHistoryGetMessagesService.getMessagesList({ connected_account_id: connected_account_id }, req);

                    return res.status(200).send(message_list);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });

    }


}
