import { Request } from 'express';
import {
    SessionDataObject
} from '../models';
import { utils } from '../lib/utils.service';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { config } from '../config';




class UserGetDataService {


    async getUser(params: { id: string, account_type: 'account' | 'user' | string }): Promise<SessionDataObject> {

        try {


            const result = await mysql.query(`
                SELECT
                    *
                FROM
                    ${params.account_type}s
                WHERE
                    id = :id
            `, { id: params.id });


            if (result.rowsCount === 0)
                return Promise.resolve(null);


            const user: SessionDataObject = {
                user_id: result.rows[0].id,
                email: result.rows[0].email,
                username: result.rows[0].username,
                first_name: result.rows[0].first_name,
                last_name: result.rows[0].last_name,
                phone: result.rows[0].phone,
                profile_picture_url: result.rows[0]?.profile_picture_url || null,
                created_at: result.rows[0].created_at,
                authentication_2fa__app: result.rows[0].authentication_2fa__app,
                authentication_2fa__email: result.rows[0].authentication_2fa__email,
                authentication_2fa__app_secret: result.rows[0].authentication_2fa__app_secret,
                role: result.rows[0].role,
                is_account: params.account_type === 'account',
                connected_account: params.account_type === 'user' ? result.rows[0].connected_account : null,
                account_type: params.account_type
            };


            return Promise.resolve(user);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




const userGetDataService = new UserGetDataService();
export { userGetDataService };
