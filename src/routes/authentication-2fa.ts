import { Application, Request, Response } from 'express';
import { utils } from '../lib/utils.service';
import { config, emailServer } from '../config';
import { mailServer } from '../lib/connectors/mailServer';
import { QueryResult, mysql } from '../lib/connectors/mysql';

import { ActivateAccount2FAAuthenticationEmailSystem } from '../lib/email-templates/mails/authentication-2fa-email-actication';
import { SessionDataObject } from '../models';




export class Authentication2FARoutes {


    public routes(server: Application) {


        // route to send the email 2FA authentication (email sending here)
        server.route('/api/authentication/account/security/2fa/email/authentication-code/send-email')
            .put(async (req: Request, res: Response) => {

                try {

                    const user: SessionDataObject = req.body.user || null;

                    let acc_table = '';
                    if (user !== null)
                        acc_table = user.is_account ? 'accounts' : 'users';
                    else
                        acc_table = req.session.user.is_account ? 'accounts' : 'users';

                    const params: {
                        user_account_id: string;
                        acc_table: string;
                        code: string;
                    } = {
                        user_account_id: user?.user_id || req.session.user.user_id,
                        acc_table: acc_table,
                        code: utils.email2FactorAuthenticationGenerate6DigitCode(),
                    };



                    // save this record to the db acc_table
                    const insert_result = await mysql.query(`
                        INSERT INTO
                            authentication_2fa__email_codes
                        SET
                            user_account_id = :user_account_id,
                            acc_table = :acc_table,
                            code = :code
                    `, params);


                    // send email with authentication code
                    const emailId = await mailServer.send_mail({
                        from_name: emailServer.accounts_email.defaults.name,
                        from_email: emailServer.accounts_email.defaults.email,
                        from_psswd: emailServer.accounts_email.auth.password,
                        to: [user?.email || req?.session?.user?.email],
                        subject: '2FA Code',
                        html: new ActivateAccount2FAAuthenticationEmailSystem(req.session.user.first_name, req.session.user.last_name, params.code).html,
                    });



                    return res.status(200).send({
                        code: 200,
                        type: 'waiting_for_authentication',
                        message: 'Waiting for authentication',
                        emailId: emailId
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });




        // route to activate the 2fa authentication (2fa email service)
        server.route('/api/settings/account/security/2fa/email/activate')
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const authentication_code: string = req.body?.code || null;
                    if (authentication_code === null)
                        return utils.errorHandlingReturn({ code: 400, type: 'connection_adopted', message: 'No credentials found to proceed the execute' }, res);


                    const params: {
                        user_account_id: string;
                        acc_table: string;
                        code: string;
                    } = {
                        user_account_id: req.session.user.user_id,
                        acc_table: req.session.user.is_account ? 'accounts' : 'users',
                        code: authentication_code
                    };



                    // check if the code exists
                    const code_exists = await mysql.query(`
                        SELECT
                            rec_id
                        FROM
                            authentication_2fa__email_codes
                        WHERE
                            user_account_id = :user_account_id AND
                            acc_table = :acc_table AND
                            code = :code;
                    `, params);



                    if (code_exists.rowsCount === 0)
                        return utils.errorHandlingReturn({ code: 404, type: 'request_not_found', message: 'No code to be authenticated found' }, res);


                    const delete_code = await mysql.query(`DELETE FROM authentication_2fa__email_codes WHERE rec_id = :rec_id;`, { rec_id: Number(code_exists.rows[0].rec_id) });



                    // authentication method activated
                    const result = await mysql.query(`
                        UPDATE
                            ${params.acc_table}
                        SET
                            authentication_2fa__email = 1
                        WHERE
                            id = :user_account_id;
                    `, params);



                    req.session.user.authentication_2fa__email = true;


                    return res.status(200).send({
                        code: 200,
                        type: 'authentication_2fa__email_activated',
                        message: 'Email 2FA authentication service activated'
                    });


                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });




        // route to de-activate the 2fa authentication (2fa email service)
        server.route('/api/settings/account/security/2fa/email/de-activate')
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    if (!req?.session?.user?.authentication_2fa__email)
                        return utils.errorHandlingReturn({
                            code: 403,
                            type: 'no_connection_found',
                            message: 'The 2FA service via Email is not enabled'
                        }, res);

                    const authentication_code: string = req.body?.code || null;
                    if (authentication_code === null)
                        return utils.errorHandlingReturn({ code: 400, type: 'connection_adopted', message: 'No credentials found to proceed the execute' }, res);


                    const params: {
                        user_account_id: string;
                        acc_table: string;
                        code: string;
                    } = {
                        user_account_id: req.session.user.user_id,
                        acc_table: req.session.user.is_account ? 'accounts' : 'users',
                        code: authentication_code
                    };



                    // check if the code exists
                    const code_exists = await mysql.query(`
                        SELECT
                            rec_id
                        FROM
                            authentication_2fa__email_codes
                        WHERE
                            user_account_id = :user_account_id AND
                            acc_table = :acc_table AND
                            code = :code;
                    `, params);



                    if (code_exists.rowsCount === 0)
                        return utils.errorHandlingReturn({ code: 404, type: 'request_not_found', message: 'No code to be authenticated found' }, res);


                    const delete_code = await mysql.query(`DELETE FROM authentication_2fa__email_codes WHERE rec_id = :rec_id;`, { rec_id: Number(code_exists.rows[0].rec_id) });



                    // authentication method activated
                    const result = await mysql.query(`
                        UPDATE
                            ${params.acc_table}
                        SET
                            authentication_2fa__email = 0
                        WHERE
                            id = :user_account_id;
                    `, params);



                    req.session.user.authentication_2fa__email = false;


                    return res.status(200).send({
                        code: 200,
                        type: 'authentication_2fa__email_activated',
                        message: 'Email 2FA authentication service activated'
                    });


                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });




        // route to authenticate a code (2fa email service)
        server.route('/api/authentication/account/security/2fa/email/authentication-code/check')
            .put(async (req: Request, res: Response) => {

                try {

                    const authentication_code: string = req.body?.code || null;
                    if (authentication_code === null)
                        return utils.errorHandlingReturn({ code: 400, type: 'connection_adopted', message: 'No credentials found to proceed the execute' }, res);



                    const session_data = req.body?.session_data || null;
                    if (!session_data)
                        return utils.errorHandlingReturn({ code: 401, type: 'no_session_found', message: 'Session data doesn\'t found' }, res);



                    const params: {
                        user_account_id: string;
                        acc_table: string;
                        code: string;
                    } = {
                        user_account_id: session_data?.user?.user_id,
                        acc_table: session_data?.user?.is_account ? 'accounts' : 'users',
                        code: authentication_code
                    };
                    if (!params?.user_account_id)
                        return utils.errorHandlingReturn({
                            code: 400,
                            type: 'forbidden',
                            message: 'Missing credentials',
                        }, res);



                    // check if the code exists
                    const code_exists = await mysql.query(`
                        SELECT
                            rec_id
                        FROM
                            authentication_2fa__email_codes
                        WHERE
                            user_account_id = :user_account_id AND
                            acc_table = :acc_table AND
                            code = :code;
                    `, params);



                    if (code_exists.rowsCount === 0)
                        return utils.errorHandlingReturn({ code: 404, type: 'request_not_found', message: 'No code to be authenticated found' }, res);


                    const delete_code = await mysql.query(`DELETE FROM authentication_2fa__email_codes WHERE rec_id = :rec_id;`, { rec_id: Number(code_exists.rows[0].rec_id) });



                    req.session.user = session_data.user;
                    req.session.created_at = session_data.created_at;
                    if (session_data?.cookie?.originalMaxAge)
                        req.session.cookie.maxAge = session_data?.cookie?.originalMaxAge;


                    req.session.save(async (errorSave) => {
                        if (errorSave)
                            throw errorSave;


                        req.session.reload(async (errorReload) => {
                            if (errorReload)
                                throw errorReload;



                            // take data from session
                            // const session_parsed_data = await sessionDataGetService.getSessionData(geolocation_data.user_account_id);
                            // geolocation_data.session_id = session_parsed_data.sid;
                            // geolocation_data.expires = session_parsed_data.expires;
                            // geolocation_data.session_data = session_parsed_data.data;


                            // save record
                            // await addGeolocationLogInDataService.addData(geolocation_data);

                            // 7. Send response
                            return res.status(200).send({ user: req.session.user, is_valid: true });

                        });

                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });





        // route to generate new 2FA secret for Authenticator App
        server.route('/api/authentication/account/security/2fa/app/authentication-code/key')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const user_secret = utils.speakeasy.generateSecret({ length: 32 });

                    return res.status(200).send({
                        otpauth_url: user_secret.otpauth_url,
                        code: user_secret.base32
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });



        // enable 2fa service
        server.route('/api/settings/accouns/security/2fa/app/enable')
            .put(async (req: Request, res: Response) => {

                try {

                    const data: {
                        secret: string;
                        code: string;
                    } = {
                        secret: req?.body?.secret || null,
                        code: req?.body?.code || null,
                    };

                    if (!data?.secret || !data?.code)
                        return utils.errorHandlingReturn({
                            code: 400,
                            type: 'forbidden',
                            message: 'Missing credentials',
                        }, res);



                    const is_valid = utils.speakeasy.totp.verify({
                        secret: data.secret,
                        encoding: 'base32',
                        token: data.code
                    });



                    if (!is_valid)
                        return utils.errorHandlingReturn({
                            code: 403,
                            type: 'token_validation_failed',
                            message: 'The token cannot be verified',
                        }, res);




                    const params: {
                        user_account_id: string;
                        acc_table: string;
                        secret: string;
                        tfa_activated: number;
                    } = {
                        user_account_id: req.session.user.user_id,
                        acc_table: req.session.user.is_account ? 'accounts' : 'users',
                        secret: data.secret,
                        tfa_activated: 1,
                    };


                    const result = await mysql.query(`
                        UPDATE
                            ${params.acc_table}
                        SET
                            authentication_2fa__app = :tfa_activated,
                            authentication_2fa__app_secret = :secret
                        WHERE
                            id = :user_account_id;
                    `, params);



                    req.session.user.authentication_2fa__app = true;
                    req.session.user.authentication_2fa__app_secret = params.secret;


                    return res.status(200).send({
                        code: 200,
                        type: 'connection_succeeded',
                        message: 'Connection with authenticator app created successfully',
                    });


                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });



        // disable 2fa service
        server.route('/api/settings/account/security/2fa/app/disable')
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    if (!req?.session?.user?.authentication_2fa__app)
                        return utils.errorHandlingReturn({
                            code: 402,
                            type: 'no_connection_found',
                            message: 'The 2FA service via Authenticator app is not enabled',
                        }, res);



                    if (!req?.session?.user?.authentication_2fa__app_secret)
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'no_secret_key_found',
                            message: 'Secret key to validate this action cannot be found'
                        }, res);





                    const params: {
                        user_account_id: string;
                        acc_table: string;
                        secret: string;
                        tfa_activated: number;
                        token: string;
                        generated_token: string;
                        token_is_valid: boolean;
                    } = {
                        user_account_id: req.session.user.user_id,
                        acc_table: req.session.user.is_account ? 'accounts' : 'users',
                        secret: req.session.user.authentication_2fa__app_secret,
                        tfa_activated: 0,
                        token: req?.body?.code || null,
                        generated_token: utils.speakeasy.totp({
                            secret: req.session.user.authentication_2fa__app_secret,
                            encoding: 'base32',
                        }),
                        token_is_valid: utils.speakeasy.totp.verify({
                            secret: req.session.user.authentication_2fa__app_secret,
                            encoding: 'base32',
                            token: req?.body?.code || null,
                            window: 6
                        }),
                    };



                    if (!params?.token)
                        return utils.errorHandlingReturn({
                            code: 400,
                            type: 'token_not_found',
                            message: 'Token to validate not found'
                        }, res);




                    if (!params?.token_is_valid)
                        return utils.errorHandlingReturn({
                            code: 403,
                            type: 'token_invalid',
                            message: '6-digit code is not valid',
                        }, res);




                    const result = await mysql.query(`
                        UPDATE
                            ${params.acc_table}
                        SET
                            authentication_2fa__app = 0,
                            authentication_2fa__app_secret = NULL
                        WHERE
                            id = :user_account_id;
                    `, params);


                    return res.status(200).send({
                        code: 200,
                        type: 'service_disabled',
                        message: '2FA via Authenticator App service disabled successfully',
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });



        // verify 2fa token
        server.route('/api/authentication/account/security/2fa/app/authentication-code/verify')
            .put(async (req: Request, res: Response) => {

                try {

                    if (!req?.body?.code)
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'no_token_found',
                            message: 'No token submitted with form',
                        }, res);

                    const session_data = req.body?.session_data || null;
                    if (!session_data)
                        return utils.errorHandlingReturn({ code: 400, type: 'no_session_found', message: 'Session data doesn\'t found' }, res);



                    const params: {
                        user_account_id: string;
                        acc_table: string;
                        code: string;
                        secret: string;
                    } = {
                        user_account_id: session_data?.user?.user_id || null,
                        acc_table: session_data?.user?.is_account ? 'accounts' : 'users',
                        code: req.body.code,
                        secret: session_data?.user?.authentication_2fa__app_secret || null,
                    };
                    if (!params?.user_account_id || !params?.secret)
                        return utils.errorHandlingReturn({
                            code: 400,
                            type: 'forbidden',
                            message: 'Missing credentials',
                        }, res);




                    const is_valid = utils.speakeasy.totp.verify({
                        secret: params.secret,
                        encoding: 'base32',
                        token: params.code,
                    });



                    if (!is_valid)
                        return utils.errorHandlingReturn({
                            code: 403,
                            type: 'token_not_match',
                            message: 'Tokens aren\'t match'
                        }, res);


                    // req.session = session_data;
                    req.session.user = session_data.user;
                    req.session.created_at = session_data.created_at;
                    if (session_data?.cookie?.originalMaxAge)
                        req.session.cookie.maxAge = session_data?.cookie?.originalMaxAge;


                    req.session.save(async (errorSave) => {
                        if (errorSave)
                            throw errorSave;


                        req.session.reload(async (errorReload) => {
                            if (errorReload)
                                throw errorReload;



                            // take data from session
                            // const session_parsed_data = await sessionDataGetService.getSessionData(geolocation_data.user_account_id);
                            // geolocation_data.session_id = session_parsed_data.sid;
                            // geolocation_data.expires = session_parsed_data.expires;
                            // geolocation_data.session_data = session_parsed_data.data;


                            // save record
                            // await addGeolocationLogInDataService.addData(geolocation_data);

                            // 7. Send response
                            return res.status(200).send({ user: req.session.user, is_valid: true });

                        });

                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });

    }


}
