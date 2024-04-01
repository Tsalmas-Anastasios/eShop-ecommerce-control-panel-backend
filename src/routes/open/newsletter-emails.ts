import { Application, Request, Response, request } from 'express';
const url = require('url');
import {
    NewsletterClientEmailData
} from '../../models';
import { utils } from '../../lib/utils.service';
import { openApiCheckerMiddlewareService } from '../../lib/open-api-middleware.service';
import { config, emailServer } from '../../config';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import validate from 'deep-email-validator';

import {
    newsletterClientsEmailAddService, newsletterClientsEmailDeleteService,
    newsletterClientsEmailCheckerService
} from '../../lib/newsletter-admin-clients.service';







export class NewsletterEmailOpenAPIRoutes {


    public routes(server: Application) {


        server.route('/api/open/:token/newsletter/new-email')
            .post(openApiCheckerMiddlewareService.checkAuthToken, async (req: Request, res: Response) => {

                try {

                    const client_email_data: NewsletterClientEmailData = {
                        ...req.body,
                        connected_account_id: utils.findAccountIdDecodeTokenVerification(req.params.token)
                    };

                    if (!client_email_data?.client_email)
                        return res.status(400).send({
                            code: 400,
                            type: 'forbidden',
                            message: 'Missing valuable data (missing email)',
                        });


                    if (!utils.isEmail(client_email_data.client_email))
                        return res.status(402).send({
                            code: 402,
                            type: 'wrong_email_format',
                            message: 'Entered email has wrong format',
                        });

                    if (!(await validate(client_email_data.client_email)).valid)
                        return res.status(403).send({
                            code: 403,
                            type: 'wrong_email',
                            message: 'This email doesn\'t exist'
                        });




                    await newsletterClientsEmailAddService.addNewEmail(client_email_data);


                    return res.status(200).send({
                        code: 200,
                        type: 'email_inserted',
                        message: 'Email saved successfully',
                    });

                } catch (error) {
                    return res.status(500).send({
                        code: 500,
                        type: 'internal_server_error',
                        message: `Internal server error. If the error still exists, please contact us on ${emailServer.errors_email.defaults.email}`
                    });
                }

            });





        server.route('/api/open/newsletter/new-email')
            .post((req: Request, res: Response) => {

                try {

                    const token_value = req.body?.token || req.headers['x-access-token'] || null;
                    if (token_value === null)
                        return res.status(401).send({
                            code: 401,
                            type: 'unauthorized',
                            message: 'Missing token key',
                        });



                    return res.redirect(
                        url.format({
                            pathname: `/api/open/${token_value}/newsletter/new-email`,
                            body: req.body
                        })
                    );

                } catch (error) {
                    return res.status(500).send({
                        code: 500,
                        type: 'internal_server_error',
                        message: `Internal server error. If the error still exists, please contact us on ${emailServer.errors_email.defaults.email}`
                    });
                }

            });







        // delete an email
        server.route('/api/open/:token/newsletter/:email_id/delete')
            .delete(openApiCheckerMiddlewareService.checkAuthToken, async (req: Request, res: Response) => {

                try {

                    const identifiers = {
                        rec_id: req.params?.email_id || null,
                        connected_account_id: utils.findAccountIdDecodeTokenVerification(req.params.token)
                    };

                    if (identifiers.rec_id === null)
                        return res.status(400).send({
                            code: 400,
                            type: 'missing_email_id',
                            message: 'Missing email ID',
                        });



                    if (newsletterClientsEmailCheckerService.emailExists(identifiers))
                        return res.status(404).send({
                            code: 404,
                            type: 'email_not_found',
                            message: 'Email not found',
                        });


                    await newsletterClientsEmailDeleteService.deleteClientEmail(identifiers);

                    return res.status(200).send({
                        code: 200,
                        type: 'email_deleted',
                        message: 'Email deleted successfully from the cloud base',
                    });

                } catch (error) {
                    return res.status(500).send({
                        code: 500,
                        type: 'internal_server_error',
                        message: `Internal server error. If the error still exists, please contact us on ${emailServer.errors_email.defaults.email}`
                    });
                }

            });



        server.route('/api/open/newsletter/:email_id/delete')
            .delete((req: Request, res: Response) => {

                try {

                    const token_value = req.body?.token || req.headers['x-access-token'] || null;
                    if (token_value === null)
                        return res.status(401).send({
                            code: 401,
                            type: 'unauthorized',
                            message: 'Missing token key',
                        });


                    if (!req.params?.email_id)
                        return res.status(401).send({
                            code: 401,
                            type: 'missing_email_id',
                            message: 'Missing email id'
                        });



                    return res.redirect(`/api/open/${token_value}/newsletter/${req.params.email_id}/delete`);

                } catch (error) {
                    return res.status(500).send({
                        code: 500,
                        type: 'internal_server_error',
                        message: `Internal server error. If the error still exists, please contact us on ${emailServer.errors_email.defaults.email}`
                    });
                }

            });

    }


}
