import { Application, Request, Response, request } from 'express';
import { utils } from '../lib/utils.service';
import { config, emailServer } from '../config';
import { mailServer } from '../lib/connectors/mailServer';

import {
    CompanyEmailData, EmailCredentialsToVerify, CompanyEmailSearchDataArgsGraphQL
} from '../models';

import {
    addNewCompanyEmailService, getCompanyEmailService, checkerCompanyEmailService,
    updateCompanyEmailService, deleteCompanyEmailService
} from '../lib/company-email.service';





export class CompanyEmailDataRoutes {

    public routes(server: Application) {



        server.route('/api/account/settings/company-emails')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const account_id = utils.findAccountIDFromSessionObject(req);
                    const company_emails: CompanyEmailData[] = await getCompanyEmailService.getList({ connected_account_id: account_id }, req);

                    return res.status(200).send(company_emails);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });



        server.route('/api/account/settings/company-emails/new')
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const data: CompanyEmailData = req.body;
                    if (!data?.email_label || !data?.host || !data?.port || !data?.user || !data?.password
                        || !data?.default_name || !data?.default_email)
                        return utils.errorHandlingReturn({ code: 400, type: 'missing_data', message: 'Missing data to insert new email' }, res);


                    if (!await mailServer.verifyEmail({
                        host: data.host,
                        port: data.port,
                        secure: data.secure,
                        email: data.user,
                        password: data.password
                    }))
                        return utils.errorHandlingReturn({
                            code: 403,
                            type: 'invalid_email_data',
                            message: 'Email validation failed! Please try again with other credentials'
                        }, res);




                    // email validation made successfully
                    // add new mail in the db
                    data.connected_account_id = utils.findAccountIDFromSessionObject(req);

                    const new_email_id = await addNewCompanyEmailService.addNewCompanyEmail(data);


                    return res.status(200).send({
                        code: 200,
                        type: 'email_inserted',
                        message: 'New email inserted successfully',
                        email_id: new_email_id
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });



        server.route('/api/account/settings/company-emails/:email_id')
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const data: CompanyEmailData = req.body;
                    if (!data?.email_label && !data?.host && !data?.port && !data?.secure && !data?.user && !data?.password
                        && !data?.default_name && !data?.default_email)
                        return utils.errorHandlingReturn({ code: 400, type: 'nothing_to_update', message: 'Nothing to update' }, res);



                    data.email_id = req.params.email_id;
                    data.connected_account_id = utils.findAccountIDFromSessionObject(req);

                    if (!await checkerCompanyEmailService.companyEmailExists({
                        email_id: data.email_id,
                        connected_account_id: data.connected_account_id
                    }))
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'email_not_found',
                            message: 'Email you are looking for, not found',
                        }, res);



                    const previous_version_email: CompanyEmailData = await getCompanyEmailService.getSpecificEmail({
                        email_id: data.email_id,
                        connected_account_id: data.connected_account_id
                    }, req);




                    if (!await mailServer.verifyEmail({
                        host: data?.host && data.host !== null ? data.host : previous_version_email.host,
                        port: data?.port && data.port !== null ? data.port : previous_version_email.port,
                        secure: data?.secure && data.secure !== null ? data.secure : previous_version_email.secure,
                        email: data?.user && data.user !== null ? data.user : previous_version_email.user,
                        password: data?.password && data.password !== null ? data.password : previous_version_email.password,
                    }))
                        return utils.errorHandlingReturn({
                            code: 403,
                            type: 'invalid_email_data',
                            message: 'Email validation failed! Please try again with other credentials'
                        }, res);




                    // validation completed --> update the email data here
                    await updateCompanyEmailService.updateCompanyEmail(data);



                    return res.status(200).send({
                        code: 200,
                        type: 'email_updated',
                        message: 'Email successfully updated',
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            })
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const identifiers = {
                        email_id: req.params.email_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req)
                    };
                    const company_email: CompanyEmailData = await getCompanyEmailService.getSpecificEmail(identifiers, req);

                    return res.status(200).send(company_email);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            })
            .delete(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const identifiers: CompanyEmailSearchDataArgsGraphQL = {
                        email_id: req.params.email_id,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                    };


                    if (!await checkerCompanyEmailService.companyEmailExists(identifiers))
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'email_not_found',
                            message: 'Email you are looking for, not found',
                        }, res);



                    // delete record from db
                    await deleteCompanyEmailService.deleteCompanyEmailService(identifiers);



                    return res.status(200).send({ code: 200, type: 'email_deleted', message: 'Email deleted successfully' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });





        server.route('/api/account/settings/company-emails/test/test-email')
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const data: CompanyEmailData = req.body;
                    if (!data?.email_label || !data?.host || !data?.port || !data?.user || !data?.password
                        || !data?.default_name || !data?.default_email)
                        return utils.errorHandlingReturn({ code: 403, type: 'missing_data', message: 'Missing data to insert new email' }, res);



                    if (!await mailServer.verifyEmail({
                        host: data.host,
                        port: data.port,
                        secure: data.secure,
                        email: data.user,
                        password: data.password
                    }))
                        return utils.errorHandlingReturn({
                            code: 400,
                            type: 'invalid_email_data',
                            message: 'Email validation failed! Please try again with other credentials'
                        }, res);




                    return res.status(200).send({
                        code: 200,
                        type: 'email_verified',
                        message: 'Email connection verified successfully'
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });

    }

}
