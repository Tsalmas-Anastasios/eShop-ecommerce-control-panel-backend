import { Application, Request, Response, request } from 'express';
import { utils } from '../lib/utils.service';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { profilePictureFileStorage } from '../lib/connectors/fileStorage/profile-picture';
import { userGetDataService } from '../lib/user.service';
import { SessionDataObject } from '../models';
import { authChecksGeneral } from '../lib/account.service';
require('dotenv').config();


export class UserRoutes {


    public routes(server: Application) {



        // get user's data
        server.route('/api/settings/users/data/user-data')
            .get(utils.checkAuth, (req: Request, res: Response) => {
                return res.status(200).send(req.session.user);
            });



        // profile picture save
        server.route('/api/settings/users/profile/picture')
            .put(utils.checkAuth, profilePictureFileStorage.diskStorage.single('profile_picture'), async (req: Request, res: Response) => {

                try {

                    const params: {
                        user_id: string;
                        type: 'user' | 'account' | string,
                    } = {
                        user_id: req?.query?.user_id?.toString() || req.session.user.user_id,
                        type: req?.query?.user_type ? req.query.user_type.toString() : req.session.user.is_account ? 'account' : 'user',
                    };


                    const file_url = `${process.env.PROFILE_PICTURE_STORAGE_FOLDER}/${req.file.filename}`;


                    const result = await mysql.query(`
                        UPDATE
                            ${params.type}s
                        SET
                            profile_picture_url = :profile_picture_url
                        WHERE
                            id = :user_account_id
                    `, {
                        profile_picture_url: file_url,
                        user_account_id: params.user_id
                    });

                    console.log(result);


                    return res.status(200).send({
                        code: 200,
                        type: 'profile_picture_updated',
                        message: 'profile_picture_updated',
                        originalname: req.file.originalname,
                        mimetype: req.file.mimetype,
                        destination: req.file.destination,
                        filename: req.file.filename,
                        file_url: file_url,
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });




        // route to update the user's data
        server.route('/api/settings/users/profile/update-data')
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const data: SessionDataObject = req.body;

                    if (!data?.account_type || !data?.created_at || !data?.email
                        || !data?.first_name || !data?.last_name || !data?.phone || !data?.role
                        || !data?.user_id || !data?.username)
                        return utils.errorHandlingReturn({ code: 400, type: 'missing_users_data', message: 'Missing user\'s critical data' }, res);


                    const old_user_data: SessionDataObject = await userGetDataService.getUser({ id: data.user_id, account_type: data.account_type });


                    // check if one of the following changed
                    //      - username
                    //      - email
                    //      - phone

                    if (old_user_data.username !== data.username)
                        if (await authChecksGeneral.userExists({ username: data.username, except_id: data.user_id }))
                            return utils.errorHandlingReturn({ code: 401, type: 'username_exists', message: 'Username already exists ' }, res);

                    if (old_user_data.email !== data.email)
                        if (await authChecksGeneral.userExists({ email: data.email, except_id: data.user_id }))
                            return utils.errorHandlingReturn({ code: 402, type: 'email_exists', message: 'E-mail already exists ' }, res);

                    if (old_user_data.phone !== data.phone)
                        if (await authChecksGeneral.userExists({ phone: data.phone, except_id: data.user_id }))
                            return utils.errorHandlingReturn({ code: 403, type: 'phone_exists', message: 'Phone already exists ' }, res);



                    const result = await mysql.query(`
                        UPDATE
                            ${data.account_type}s
                        SET
                            email = :email,
                            first_name = :first_name,
                            last_name = :last_name,
                            phone = :phone,
                            username = :username
                        WHERE
                            id = :id;

                        UPDATE
                            users_merging
                        SET
                            email = :email,
                            phone = :phone,
                            username = :username
                        WHERE
                            user_id = :id;
                    `, {
                        email: data.email,
                        first_name: data.first_name,
                        last_name: data.last_name,
                        phone: data.phone,
                        username: data.username,
                        id: data.user_id,
                    });


                    return res.status(200).send({ code: 200, type: 'user_updated', message: 'User data updated successfully' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });



    }


}
