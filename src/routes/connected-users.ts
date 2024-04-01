import { Application, Request, Response, request } from 'express';
import { utils } from '../lib/utils.service';
import { mysql } from '../lib/connectors/mysql';
import { SessionDataObject, User, UserPrivilege } from '../models';
require('dotenv').config();

import {
    connectedUsersGetListService, connectedUsersDeleteUserService, connectedUsersPostAddService,
    connectedUsersPutUpdateService, connectedUsersPrivilegesUpdate
} from '../lib/connected-users.service';
import { accountUserIDGenerator } from '../lib/id_numbers_generators/account-user';
import { authChecksGeneral } from '../lib/account.service';
import { generateData } from '../lib/account.service';
import { mailServer } from '../lib/connectors/mailServer';
import * as jwt from 'jsonwebtoken';
import { config, emailServer } from '../config';
import { InvitedUserActivationEmailTemplate } from '../lib/email-templates/mails/activate--invited-user';





export class ConnectedUsersRoutes {


    public routes(server: Application) {


        server.route('/api/settings/connected-users/list')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const connected_account_id = utils.findAccountIDFromSessionObject(req);

                    const users: User[] = await connectedUsersGetListService.getList({ connected_account: connected_account_id }, req);



                    return res.status(200).send(users);


                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });





        server.route('/api/settings/connected-users/user/:user_id')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: {
                        id: string;
                        connected_account: string;
                    } = {
                        id: req.params.user_id,
                        connected_account: utils.findAccountIDFromSessionObject(req),
                    };


                    if (!await connectedUsersGetListService.userExists(params))
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'user_not_found',
                            message: 'User didn\'t found or isn\'t connected with current account'
                        }, res);


                    const user = await connectedUsersGetListService.getUser(params, req);


                    return res.status(200).send(user);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            })
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: {
                        id: string;
                        connected_account: string;
                    } = {
                        id: req.params.user_id,
                        connected_account: utils.findAccountIDFromSessionObject(req)
                    };


                    const user: User = req.body.user;
                    if (!user)
                        return utils.errorHandlingReturn({
                            code: 400,
                            type: 'data_missing',
                            message: 'Data missing and cannot be updated'
                        }, res);


                    if (!await connectedUsersGetListService.userExists(params))
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'user_not_found',
                            message: 'User didn\'t found or isn\'t connected with current account'
                        }, res);





                    // update user's data
                    await connectedUsersPutUpdateService.updateUserMainData(user, params);



                    const update_user_merging = await mysql.query(`
                        UPDATE
                            users_merging
                        SET
                            username = :username,
                            email = :email,
                            phone = :phone
                        WHERE
                            user_id = :id
                    `, {
                        id: params.id,
                        ...user
                    });


                    // update privileges of the user
                    await connectedUsersPrivilegesUpdate.updateUserPrivileges(user.privileges, params);



                    return res.status(200).send({
                        code: 200,
                        type: 'user_updated',
                        message: 'User data updated successfully',
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            })
            .delete(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: {
                        id: string;
                        connected_account: string;
                    } = {
                        id: req.params.user_id,
                        connected_account: utils.findAccountIDFromSessionObject(req),
                    };



                    if (!await connectedUsersGetListService.userExists(params))
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'user_not_found',
                            message: 'User didn\'t found or isn\'t connected with current account'
                        }, res);


                    await connectedUsersDeleteUserService.deleteUser(params);



                    return res.status(200).send({
                        code: 200,
                        type: 'user_deleted',
                        message: 'User deleted successfully',
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });



        server.route('/api/settings/connected-users/user/u/new')
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const user: User = req.body?.user || null;
                    user.role = '-n3v4arYhf_hVunn6yTp91YD3DTdwZ9mjjOh';                 // db id (from record in user_roles table)
                    const connected_account_id = utils.findAccountIDFromSessionObject(req);

                    if (!user?.first_name || !user?.last_name || !user?.email || !user?.username
                        || !user?.phone || !user?.role)
                        return utils.errorHandlingReturn({
                            code: 400,
                            type: 'forbidden',
                            message: 'Missing data',
                        }, res);




                    // check if the user already exists
                    //      --> email
                    //      --> username
                    //      --> phone
                    if (await authChecksGeneral.userExists({ username: user.username }))
                        return utils.errorHandlingReturn({ code: 400, type: 'username_exists', message: 'Username already exists ' }, res);

                    if (await authChecksGeneral.userExists({ email: user.email }))
                        return utils.errorHandlingReturn({ code: 400, type: 'email_exists', message: 'E-mail already exists ' }, res);

                    if (await authChecksGeneral.userExists({ phone: user.phone }))
                        return utils.errorHandlingReturn({ code: 400, type: 'phone_exists', message: 'Phone already exists ' }, res);





                    const new_user_id = await connectedUsersPostAddService.addNewUser(user, connected_account_id);



                    // add privileges here
                    let sql_add_privileges = '';
                    for (const privilege of user.privileges)
                        sql_add_privileges += `
                            INSERT INTO
                                user_privileges
                            SET
                                rec_id = '${accountUserIDGenerator.getNewUserPrivilegeID()}',
                                privilege_type = '${privilege.privilege_type}',
                                value = ${privilege.value ? 1 : 0},
                                user_id = '${new_user_id}',
                                connected_account_id = '${connected_account_id}';
                        `;



                    const result = await mysql.query(sql_add_privileges);



                    // add user to table 'users_merging'
                    const add_user_merging = await mysql.query(`
                        INSERT INTO
                            users_merging
                        SET
                            user_id = :new_user_id,
                            username = :username,
                            email = :email,
                            phone = :phone,
                            connected_table = 'users';
                    `, {
                        new_user_id: new_user_id,
                        ...user
                    });



                    const activation_key = generateData.getWebToken({ user_id: new_user_id, username: user.username, email: user.email, account_type: 'user', type: 'email_activation' });


                    // get shop's name
                    const shop_name_result = await mysql.query(`SELECT shop_name FROM companies WHERE connected_account_id = :connected_account_id`, { connected_account_id: connected_account_id });
                    const shop_name = shop_name_result.rows[0].shop_name.toString();


                    // send email
                    const emailId = await mailServer.send_mail({
                        from_name: emailServer.accounts_email.defaults.name,
                        from_email: emailServer.accounts_email.defaults.email,
                        from_psswd: emailServer.accounts_email.auth.password,
                        to: [user.email],
                        subject: 'You are invited to be a part of us',
                        html: new InvitedUserActivationEmailTemplate(user.first_name, user.last_name, shop_name, activation_key).html,
                    });


                    return res.status(200).send({
                        code: 200,
                        type: 'user_added',
                        activation_key: activation_key,
                        new_user_id: new_user_id,
                        username: user.username,
                        email: user.email,
                        emailId: emailId,
                        message: 'User added successfully to the list of users',
                    });


                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });






        // modify the user's privileges
        server.route('/api/settings/connected-users/user/:user_id/privileges')
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const params: {
                        id: string;
                        connected_account: string;
                    } = {
                        id: req.params.user_id,
                        connected_account: utils.findAccountIDFromSessionObject(req)
                    };


                    const user_privileges: UserPrivilege[] = req.body.user_privileges;
                    if (!user_privileges)
                        return utils.errorHandlingReturn({
                            code: 400,
                            type: 'data_missing',
                            message: 'Data missing and cannot be updated'
                        }, res);


                    if (!connectedUsersGetListService.userExists(params))
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'user_not_found',
                            message: 'User didn\'t found or isn\'t connected with current account'
                        }, res);



                    // update privileges of the user
                    await connectedUsersPrivilegesUpdate.updateUserPrivileges(user_privileges, params);



                    return res.status(200).send({
                        code: 200,
                        type: 'user_privileges_updated',
                        message: 'User privileges updated successfully',
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });





        // change the password of a user from admin panel
        server.route('/api/settings/connected-users/user/:user_id/password/change')
            .put(async (req: Request, res: Response) => {

                try {

                    const params: {
                        id: string;
                        connected_account: string;
                    } = {
                        id: req.params.user_id,
                        connected_account: utils.findAccountIDFromSessionObject(req)
                    };


                    if (!connectedUsersGetListService.userExists(params))
                        return utils.errorHandlingReturn({
                            code: 404,
                            type: 'user_not_found',
                            message: 'User didn\'t found or isn\'t connected with current account'
                        }, res);



                    const passwords: {
                        new_password: string;
                        confirm_password: string;
                    } = req.body.passwords;



                    if (!passwords)
                        return utils.errorHandlingReturn({
                            code: 201,
                            type: 'nothing_to_update',
                            message: 'Nothing to update',
                        }, res);


                    if (passwords.new_password !== passwords.confirm_password)
                        return utils.errorHandlingReturn({ code: 400, type: 'forbidden', message: 'Passwords do not match' }, res);




                    // update password here
                    const result = await mysql.query(`
                        UPDATE
                            users
                        SET
                            password = :password
                        WHERE
                            id = :id AND
                            connected_account = :connected_account;
                    `, {
                        password: utils.generateHash(passwords.new_password),
                        ...params
                    });



                    return res.status(200).send({ code: 200, type: 'password_updated', message: 'User\'s password updated successfully' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });





        // get primary accounts data
        server.route('/api/settings/connected-users/primary-account')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    if (req.session.user.is_account)
                        return res.status(200).send(req.session.user);


                    const account_id = utils.findAccountIDFromSessionObject(req);


                    const account_data = await mysql.query(`SELECT * FROM accounts WHERE id = :id`, { id: account_id });


                    const account: SessionDataObject = {
                        user_id: account_id,
                        first_name: account_data.rows[0].first_name,
                        last_name: account_data.rows[0].last_name,
                        email: account_data.rows[0].email,
                        username: account_data.rows[0].username,
                        phone: account_data.rows[0].phone,
                        profile_picture_url: account_data.rows[0]?.profile_picture_url || null,
                        created_at: account_data.rows[0].created_at,
                        role: account_data.rows[0].role,
                        is_account: true,
                        using_bizyhive_cloud: account_data.rows[0].using_bizyhive_cloud ? true : false,
                        account_type: 'account',
                        authentication_2fa__app: account_data.rows[0].authentication_2fa__app,
                        authentication_2fa__email: account_data.rows[0].authentication_2fa__email,
                        authentication_2fa__app_secret: account_data.rows[0].authentication_2fa__app_secret,
                    };


                    return res.status(200).send(account);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });




        // resend verification email for a user
        server.route('/api/settings/connected-users/resend-verification-email')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                const user_id = req?.query?.user_id?.toString() || null;
                const connected_account_id = utils.findAccountIDFromSessionObject(req);

                if (!user_id)
                    return utils.errorHandlingReturn({
                        code: 400,
                        type: 'missing_data',
                        message: 'Missing data and cannot locate the user',
                    }, res);



                const user_data: {
                    user_id: string;
                    username: string;
                    email: string;
                    account_type: string;
                    type: string;
                    first_name?: string;
                    last_name?: string
                } = {
                    user_id: user_id,
                    username: null,
                    email: null,
                    account_type: 'user',
                    type: 'email_activation',
                };



                try {

                    const result = await mysql.query(`SELECT username, email, first_name, last_name, activated FROM users WHERE id = :user_id`, { user_id: user_data.user_id });
                    if (result.rowsCount === 0)
                        return utils.errorHandlingReturn({ code: 404, type: 'user_not_exist', message: 'There is not a user with these credentials' }, res);


                    const activated = Number(result.rows[0].activated) ? true : false;

                    if (activated)
                        return res.status(300).send({
                            code: 300,
                            type: 'account_is_active',
                            message: 'Account has already been activated'
                        });

                    user_data.username = result.rows[0].username.toString();
                    user_data.email = result.rows[0].email.toString();
                    user_data.first_name = result.rows[0].first_name.toString();
                    user_data.last_name = result.rows[0].last_name.toString();


                    const activation_key = generateData.getWebToken(user_data);


                    const shop_name_result = await mysql.query(`SELECT shop_name FROM companies WHERE connected_account_id = :connected_account_id`, { connected_account_id: connected_account_id });
                    const shop_name = shop_name_result.rows[0].shop_name.toString();



                    const emailId = await mailServer.send_mail({
                        from_name: emailServer.accounts_email.defaults.name,
                        from_email: emailServer.accounts_email.defaults.email,
                        from_psswd: emailServer.accounts_email.auth.password,
                        to: [user_data.email],
                        subject: 'You are invited to be a part of us',
                        html: new InvitedUserActivationEmailTemplate(user_data.first_name, user_data.last_name, shop_name, activation_key).html,
                    });



                    return res.status(200).send({
                        code: 200,
                        type: 'email_sent',
                        message: 'Activation email sent successfully',
                        emailId: emailId,
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });


    }


}
