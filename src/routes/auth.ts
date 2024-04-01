import { Application, Request, Response, request } from 'express';
import {
    Account, LoginAuthData, UserMergingData, User, AccountUserBasicImportantCommonData, RegistrationData,
    AccountRegistrationData, UserRegistrationData, AccountActivationData, ActivationKeyData, RequestNewPasswordData,
    GenerateTokenToChangePassword, ChangePasswordRequest, ChangePasswordRequestKeyContent, ChangePasswordNewPassword,
    SaveDataFromLoginSession
} from '../models';
import { utils } from '../lib/utils.service';
import {
    authenticationLoginService, authChecksGeneral, registrationService, generateData, emailActivationService,
    requestNewPassword, sessionDataGetService, addGeolocationLogInDataService
} from '../lib/account.service';
import { connectedUsersPrivilegesGetList } from '../lib/connected-users.service';
import { companyDataGetService } from '../lib/company-data.service';
import { config, emailServer } from '../config';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { mailServer } from '../lib/connectors/mailServer';

// email templates
import { ActivateAccountEmailTemplate } from '../lib/email-templates/mails/activate-account';
import { PasswordResetEmailTemplate } from '../lib/email-templates/mails/password-reset-link';
import { AccountPasswordChangedEmail } from '../lib/email-templates/mails/account-password-changed';

export class AuthRoutes {

    // route for logion
    public routes(server: Application): void {

        // login
        server.route('/api/auth/login')
            .post(async (req: Request, res: Response) => {

                try {

                    const data: LoginAuthData = req.body;
                    // data should contains: username, password

                    if (!data?.username || !data?.password)
                        return utils.errorHandlingReturn({ code: 400, type: 'bad_request', message: 'Login credentrials are missing' }, res);

                    if (!data?.remember_me)
                        data.remember_me = false;


                    // check the validation
                    // 1. get the user from db
                    // 2. check if user has verified his email
                    // 3. check if password is correct
                    // 4. configuration-initialization of user/account related attributes
                    // 5. save session with user data
                    // 7. send response


                    // get the user from db (check if username is email or not)
                    let demo_user: UserMergingData = null;
                    let usernameIsEmail = false;
                    if (utils.isEmail(data.username)) {                       // is email
                        // get user by email
                        demo_user = await authenticationLoginService.getUser({ email: data.username });
                        usernameIsEmail = true;
                    } else
                        // get user by username
                        demo_user = await authenticationLoginService.getUser({ username: data.username });




                    if (demo_user?.user_id === null)
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'user_not_found_username_or_email_wrong',
                            message: 'User not found, wrong username/email'
                        }, res);


                    // take data from the user's account from specific table
                    let data_tbl: 'accounts' | 'users';
                    if (demo_user.connected_table === 'accounts')
                        data_tbl = 'accounts';
                    else
                        data_tbl = 'users';

                    const user: AccountUserBasicImportantCommonData | Account | User = await authenticationLoginService.getUserDataFromUserType({ id: demo_user.user_id }, 'common_data', data_tbl);



                    // check if the user has verified his email
                    if (!user.activated)
                        return utils.errorHandlingReturn({ code: 403, type: 'forbidden', message: 'Your email is not activated' }, res);


                    // check if given password is correct
                    if (!bcrypt.compareSync(data.password.toString(), user.password))
                        return utils.errorHandlingReturn({ code: 493, type: 'forbidden', message: 'Wrong password' }, res);

                    delete user.password;

                    // create the session




                    // geolocation first
                    // const geolocation_data: SaveDataFromLoginSession = {
                    //     login_id: utils.generateId(36, config.nanoid_alphabet),
                    //     connected_account_id: null,
                    //     user_account_id: null,
                    //     session_id: null,
                    //     expires: null,
                    //     session_data: null,
                    //     country_code: req.query?.country_code.toString() || null,
                    //     country_name: req.query?.country_name.toString() || null,
                    //     city: req.query?.city.toString() || null,
                    //     postal: req.query?.postal.toString() || null,
                    //     latitude: Number(req.query?.latitude) || null,
                    //     longitude: Number(req.query?.longitude) || null,
                    //     ipv4: req.query?.ipv4.toString() || null,
                    //     ipv6: req.query?.ipv6.toString() || null,
                    //     state: req.query?.state.toString() || null,
                    //     using_bizyhive_cloud: true,
                    // };


                    if (data_tbl === 'accounts') {
                        const using_bizyhive_cloud: boolean = await authenticationLoginService.accountUsingBizyhiveCloud({ id: user.id, username: user.username, email: user.email });
                        if (using_bizyhive_cloud === null)
                            return utils.errorHandlingReturn({
                                code: 404,
                                type: 'user_not_found_username_or_email_wrong',
                                message: 'User not found'
                            }, res);

                        // geolocation_data.using_bizyhive_cloud = using_bizyhive_cloud;
                        // geolocation_data.connected_account_id = user.id;
                        // geolocation_data.user_account_id = user.id;
                        req.session.user = {
                            user_id: user.id,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email,
                            username: user.username,
                            phone: user.phone,
                            profile_picture_url: user.profile_picture_url || null,
                            created_at: user.created_at as string,
                            role: user.role,
                            is_account: true,
                            using_bizyhive_cloud: using_bizyhive_cloud ? true : false,
                            account_type: 'account',
                            authentication_2fa__app: user.authentication_2fa__app,
                            authentication_2fa__email: user.authentication_2fa__email,
                            authentication_2fa__app_secret: user.authentication_2fa__app_secret,
                            company_data: await companyDataGetService.getCompanyData({ connected_account_id: user.id }, req),
                            privileges: null,
                        };
                    } else {
                        const connected_account: string = await authenticationLoginService.connectedAccountToUser({ id: user.id });
                        if (connected_account === null)
                            return utils.errorHandlingReturn({
                                code: 404,
                                type: 'user_not_found_username_or_email_wrong',
                                message: 'User not found'
                            }, res);
                        const using_bizyhive_cloud: boolean = await authenticationLoginService.accountUsingBizyhiveCloud({ id: connected_account });
                        if (using_bizyhive_cloud === null)
                            return utils.errorHandlingReturn({
                                code: 404,
                                type: 'user_not_found_username_or_email_wrong',
                                message: 'User not found'
                            }, res);


                        // geolocation_data.using_bizyhive_cloud = using_bizyhive_cloud;
                        // geolocation_data.connected_account_id = connected_account;
                        // geolocation_data.user_account_id = user.id;
                        req.session.user = {
                            user_id: user.id,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email,
                            username: user.username,
                            phone: user.phone,
                            profile_picture_url: user.profile_picture_url || null,
                            created_at: user.created_at as string,
                            role: user.role,
                            is_account: false,
                            connected_account: connected_account,
                            using_bizyhive_cloud: using_bizyhive_cloud ? true : false,
                            account_type: 'user',
                            authentication_2fa__app: user.authentication_2fa__app,
                            authentication_2fa__email: user.authentication_2fa__email,
                            authentication_2fa__app_secret: user.authentication_2fa__app_secret,
                            company_data: await companyDataGetService.getCompanyData({ connected_account_id: connected_account }),
                            privileges: await connectedUsersPrivilegesGetList.getPrivileges({ user_id: user.id, connected_account_id: connected_account }),
                        };
                    }



                    // TODO: add geolocation and meta-data saving process


                    if (data.remember_me)
                        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days



                    req.session.created_at = utils.moment().toDate();



                    if (!req?.session?.user?.authentication_2fa__app && !req?.session?.user?.authentication_2fa__email)
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
                                return res.status(200).send(req.session.user);

                            });

                        });
                    else
                        return res.status(200).send(req.session);


                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });




        // user registration
        server.route('/api/auth/register')
            .post(async (req: Request, res: Response) => {

                try {

                    const data: RegistrationData = req.body;

                    // check the data arrived
                    if (!data?.first_name || !data?.last_name || !data?.email || !data?.username
                        || !data?.password || !data?.confirm_password || !data?.phone || !data?.role
                        || !data?.is_account)
                        return utils.errorHandlingReturn({ code: 400, type: 'bad_request', message: 'Credentials to register the user are missing' }, res);

                    if (!data.is_account && !data?.connected_account)
                        return utils.errorHandlingReturn({ code: 400, type: 'bad_request', message: 'The connected account credentials are missing' }, res);

                    if (data.is_account && !data?.company_name)
                        return utils.errorHandlingReturn({ code: 400, type: 'bad_request', message: 'Company name is missing' }, res);


                    // check if user exists
                    if (await authChecksGeneral.userExists({ username: data.username }))
                        return utils.errorHandlingReturn({ code: 401, type: 'username_exists', message: 'Username already exists ' }, res);

                    if (await authChecksGeneral.userExists({ email: data.email }))
                        return utils.errorHandlingReturn({ code: 401, type: 'email_exists', message: 'E-mail already exists ' }, res);

                    if (await authChecksGeneral.userExists({ phone: data.phone }))
                        return utils.errorHandlingReturn({ code: 401, type: 'phone_exists', message: 'Phone already exists ' }, res);

                    // check if the passwords are equal and delete the confirmation password
                    if (data.password !== data.confirm_password)
                        return utils.errorHandlingReturn({ code: 401, type: 'invalid_data', message: `Passwords don't match` }, res);

                    delete data.confirm_password;           // delete the confirmation password


                    // check if the password meets the criteria
                    // password should contain: A-Z, a-z, 0-9, !@#$%^&*
                    // password length: 8-20
                    if (data.password.length < 8 || data.password.length > 20)
                        return utils.errorHandlingReturn({ code: 402, type: 'password_out_of_range', message: 'Password length out of range' }, res);

                    if (!registrationService.checkPassword(data.password))
                        return utils.errorHandlingReturn({ code: 402, type: 'password_not_strength', message: `Password doesn't meet the criteria` }, res);


                    // create new user - account
                    let new_id: string;
                    let activation_key: string;
                    if (data.is_account) {
                        // insert account
                        if (data?.connected_account) delete data.connected_account;
                        delete data.is_account;
                        new_id = await registrationService.insertNewAccount(data as AccountRegistrationData);
                        activation_key = generateData.getWebToken({ user_id: new_id, username: data.username, email: data.email, account_type: 'account', type: 'email_activation' });
                    } else {
                        // insert user
                        if (data?.company_name) delete data.company_name;
                        delete data.is_account;
                        new_id = await registrationService.insertNewUser(data as UserRegistrationData);
                        activation_key = generateData.getWebToken({ user_id: new_id, username: data.username, email: data.email, account_type: 'user', type: 'email_activation' });
                    }

                    delete data.password;


                    // send email
                    const emailId = await mailServer.send_mail({
                        from_name: emailServer.accounts_email.defaults.name,
                        from_email: emailServer.accounts_email.defaults.email,
                        from_psswd: emailServer.accounts_email.auth.password,
                        to: [data.email],
                        subject: 'Thank you for your register! Please activate your account!',
                        html: new ActivateAccountEmailTemplate(data.first_name, data.last_name, activation_key).html,
                    });

                    return res.status(200).send({
                        code: 200,
                        type: 'user_account_created_successfully',
                        activation_key: activation_key,
                        new_user_id: new_id,
                        username: data.username,
                        email: data.email,
                        message: 'Account / User created successfully',
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });



        // email activations
        server.route('/api/auth/email-activation')
            .get(async (req: Request, res: Response) => {

                try {
                    const params: AccountActivationData = req.query as any;            // ?key=

                    if (!params?.key)
                        return utils.errorHandlingReturn({ code: 400, type: 'bad_request', message: 'Activation parameters are missing!' }, res);

                    const tokenData: ActivationKeyData = jwt.decode(params.key.toString(), { completed: true });

                    if (tokenData.type !== 'email_activation')
                        return utils.errorHandlingReturn({ code: 401, type: 'unauthorized', message: `The key isn't an activation token` }, res);


                    if (emailActivationService.checkIfKeyExpires({ expDate: tokenData.exp })) {
                        const activation_key: string = generateData.getWebToken({ user_id: tokenData.user_id, username: tokenData.username, email: tokenData.email, account_type: tokenData.account_type, type: 'email_activation' });
                        return utils.errorHandlingReturn({ code: 419, type: 'activation_key_expired', message: 'Activation key has expired', activation_key: activation_key }, res);
                    }


                    // check if the user has already activated
                    let userAlreadyActivated: boolean;
                    if (tokenData.account_type === 'account') userAlreadyActivated = await emailActivationService.userIsActivated({ id: tokenData.user_id }, 'accounts');
                    else if (tokenData.account_type === 'user') userAlreadyActivated = await emailActivationService.userIsActivated({ id: tokenData.user_id }, 'users');
                    if (userAlreadyActivated)
                        return utils.errorHandlingReturn({ code: 201, type: 'already_activated', message: 'This account (account email) has been already activated' }, res);



                    // activate user
                    if (tokenData.account_type === 'account') await emailActivationService.activateUser({ id: tokenData.user_id }, 'accounts');
                    else if (tokenData.account_type === 'user') await emailActivationService.activateUser({ id: tokenData.user_id }, 'users');

                    return res.status(200).send({ code: 200, type: 'successful_account_activation', message: 'User account activated successfully!', user_id: tokenData.user_id });
                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });



        // request link to change the password
        server.route('/api/auth/request-new-password')
            .post(async (req: Request, res: Response) => {

                try {

                    const data: RequestNewPasswordData = req.body;
                    if (!data?.username)
                        return utils.errorHandlingReturn({ code: 400, type: 'bad_request', message: 'Credentials to generate the token are missing' }, res);


                    // check if the user exists
                    if (utils.isEmail(data.username))
                        // username is email
                        if (!await authChecksGeneral.userExists({ email: data.username }))
                            return utils.errorHandlingReturn({ code: 404, type: 'user_not_found', message: 'User not found' }, res);
                    if (!utils.isEmail(data.username))
                        // username is NOT email
                        if (!await authChecksGeneral.userExists({ username: data.username }))
                            return utils.errorHandlingReturn({ code: 404, type: 'user_not_found', message: 'User not found' }, res);



                    // find data to generate token
                    let tokenData: GenerateTokenToChangePassword;
                    if (utils.isEmail(data.username))
                        tokenData = await requestNewPassword.findDataToGenerateToken({ email: data.username });
                    else
                        tokenData = await requestNewPassword.findDataToGenerateToken({ username: data.username });


                    // generate web token
                    const webToken: string = generateData.getWebToken({ user_id: tokenData.id, username: tokenData.username, email: tokenData.email, account_type: tokenData.account_type, type: 'change_password' });


                    // change the status of request_password_change from 0 to 1
                    await requestNewPassword.changeStatusInDBRequestNewPassword({ username: tokenData.username, email: tokenData.email }, tokenData.account_type);




                    const user_data = {
                        first_name: await requestNewPassword.accountData({ account_id: tokenData.id, account_type: tokenData.account_type, data: 'first_name' }),
                        last_name: await requestNewPassword.accountData({ account_id: tokenData.id, account_type: tokenData.account_type, data: 'last_name' }),
                        email: await requestNewPassword.accountData({ account_id: tokenData.id, account_type: tokenData.account_type, data: 'email' }),
                    };
                    const emailId = await mailServer.send_mail({
                        from_name: emailServer.accounts_email.defaults.name,
                        from_email: emailServer.accounts_email.defaults.email,
                        from_psswd: emailServer.accounts_email.auth.password,
                        to: [user_data.email],
                        subject: 'Bizyhive - Password reset link',
                        html: new PasswordResetEmailTemplate(webToken, user_data.first_name, user_data.last_name).html,
                    });


                    return res.status(200).send({
                        code: 200,
                        type: 'generate_token_successful',
                        user_id: tokenData.id,
                        username: tokenData.username,
                        email: tokenData.email,
                        account_type: tokenData.account_type,
                        token: webToken,
                        message: 'Token to change the password created successfully',
                    });


                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });



        // check if the token to change the password is valid
        server.route('/api/auth/check-password-change-token')
            .get(async (req: Request, res: Response) => {

                try {

                    const params: ChangePasswordRequest = req.query as any;

                    if (!params?.key)
                        return utils.errorHandlingReturn({ code: 400, type: 'bad_request', message: 'Required parameters are missing' }, res);

                    const tokenData: ChangePasswordRequestKeyContent = jwt.decode(params.key, { completed: true });

                    if (!authChecksGeneral.userExists({ user_id: tokenData.user_id, username: tokenData.username, email: tokenData.email }))
                        return utils.errorHandlingReturn({ code: 404, type: 'user_not_found', message: 'User doesn\'t exists' }, res);


                    // check if user wants password change or not
                    if (!await requestNewPassword.checkIfUserWantPasswordChange({ username: tokenData.username, email: tokenData.email }, tokenData.account_type))
                        return utils.errorHandlingReturn({ code: 401, type: 'unauthorized', message: `Password change request didn't exist` }, res);


                    // request is valid
                    return res.status(200).send({
                        code: 200,
                        type: 'successful_key_validation',
                        valid: true,
                        message: `Successful key validation. You can change your password now`,
                        key: params.key,
                        id: tokenData.user_id,
                        account_type: tokenData.account_type,
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });



        // change the password
        server.route('/api/auth/change-password')
            .put(async (req: Request, res: Response) => {

                try {

                    const data: ChangePasswordNewPassword = req.body;

                    // check the data
                    if (!data?.id || !data?.password || !data?.confirm_password || !data?.account_type)
                        return utils.errorHandlingReturn({ code: 400, type: 'bad_request', message: 'Required parameters are missing' }, res);


                    if (data.password !== data.confirm_password)
                        return utils.errorHandlingReturn({ code: 406, type: 'password_not_same', message: `Passsword and Confirm password are not the same` }, res);

                    delete data.confirm_password;

                    // check if the password meets the criteria
                    // password should contain: A-Z, a-z, 0-9, !@#$%^&*
                    // password length: 8-20
                    // if (data.password.length < 8 || data.password.length > 20)
                    //     return res.status(400).send({ code: 400, type: 'password_out_of_range', message: 'Password length out of range' });

                    // if (!registrationService.checkPassword(data.password))
                    //     return res.status(400).send({ code: 400, type: 'password_not_strength', message: `Password doesn't meet the criteria` });


                    // update password
                    await requestNewPassword.changeRequestNewPasswordStatusDisable(data.id, data.account_type);
                    await requestNewPassword.changePassword(data.id, data.password, data.account_type);
                    delete data.password;


                    // send email here
                    const user_data = {
                        first_name: await requestNewPassword.accountData({ account_id: data.id, account_type: data.account_type, data: 'first_name' }),
                        last_name: await requestNewPassword.accountData({ account_id: data.id, account_type: data.account_type, data: 'last_name' }),
                        email: await requestNewPassword.accountData({ account_id: data.id, account_type: data.account_type, data: 'email' }),
                    };
                    const emailId = await mailServer.send_mail({
                        from_name: emailServer.accounts_email.defaults.name,
                        from_email: emailServer.accounts_email.defaults.email,
                        from_psswd: emailServer.accounts_email.auth.password,
                        to: [user_data.email],
                        subject: 'Password changed successfully!',
                        html: new AccountPasswordChangedEmail(user_data.first_name, user_data.last_name, Date()).html,
                    });


                    return res.status(200).send({ code: 200, type: 'password_changed', message: 'Password successfully changed' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });




        // logout from session
        server.route('/api/auth/logout')
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    req.session.destroy(async (err) => {
                        if (err)
                            return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: err.message }, res);
                        else
                            return res.status(200).send({ code: 200, status: '200 OK', message: 'Logout OK' });
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error.message }, res);
                }

            });




        // change password inside from the app
        server.route('/api/auth/change-password-directly')
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const form_data: {
                        old_password?: string;
                        new_password: string;
                    } = req.body;


                    if (!form_data.old_password || !form_data?.new_password)
                        return utils.errorHandlingReturn({
                            code: 400,
                            type: 'missing_form_data',
                            message: 'Missing form data (new password is missing)',
                        }, res);


                    const account_type = req.session.user.is_account ? 'account' : 'user';


                    const user: AccountUserBasicImportantCommonData | Account | User = await authenticationLoginService.getUserDataFromUserType({ id: req.session.user.user_id }, 'common_data', `${account_type}s`);
                    if (!bcrypt.compareSync(form_data.old_password.toString(), user.password))
                        return utils.errorHandlingReturn({ code: 403, type: 'forbidden', message: 'Wrong old password' }, res);


                    await requestNewPassword.changePassword(req.session.user.user_id, form_data.new_password, account_type);


                    return res.status(200).send({
                        code: 200,
                        type: 'password_updated',
                        message: 'Password updated successfully!',
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error.message }, res);
                }

            });

    }

}

