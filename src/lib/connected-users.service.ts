import { Request } from 'express';
import {
    SessionDataObject, User, UserPrivilege
} from '../models';
import { utils } from '../lib/utils.service';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';
import { config } from '../config';

import { accountUserIDGenerator } from './id_numbers_generators/account-user';





class ConnectedUsersGetListService {


    async getList(params?: { id?: string, connected_account: string }, req?: Request): Promise<User[]> {


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
                        connectedUsers${graphQueryParams !== '()' ? graphQueryParams : ''}{
                            id
                            first_name
                            last_name
                            email
                            username
                            phone
                            profile_picture_url
                            activated
                            created_at
                            connected_account
                            is_account
                            role
                            role_name
                            authentication_2fa__app
                            authentication_2fa__email
                            authentication_2fa__app_secret

                            sessions{
                                sid
                                expires
                                data
                            }

                            company_data{
                                rec_id
                                business_name
                                shop_name
                                tax_id
                                tax_authority
                                contact_person__first_name
                                contact_person__last_name
                                contact_person__middle_name
                                contact_email
                                contact_phone
                                company_email
                                company_phone
                                shop_url
                                shop_type
                                products_categories
                                headquarters_address__street
                                headquarters_address__city
                                headquarters_address__postal_code
                                headquarters_address__state
                                headquarters_address__country
                                headquarters_longitude
                                headquarters_latitude
                                operating_hours__monday_start
                                operating_hours__monday_end
                                operating_hours__monday_close
                                operating_hours__tuesday_start
                                operating_hours__tuesday_end
                                operating_hours__tuesday_close
                                operating_hours__wednesday_start
                                operating_hours__wednesday_end
                                operating_hours__wednesday_close
                                operating_hours__thursday_start
                                operating_hours__thursday_end
                                operating_hours__thursday_close
                                operating_hours__friday_start
                                operating_hours__friday_end
                                operating_hours__friday_close
                                operating_hours__saturday_start
                                operating_hours__saturday_end
                                operating_hours__saturday_close
                                operating_hours__sunday_start
                                operating_hours__sunday_end
                                operating_hours__sunday_close
                                facebook_url
                                instagram_url
                                twitter_url
                                linkedin_url
                                youtube_url
                                whatsapp_url
                                tiktok_url
                                google_business_url
                                shop_google_rate_url
                                company_description
                                shop_logo
                                connected_account_id

                                coin_symbol
                                coin_label
                                coin_description
                                coin_correspondence_in_eur
                                coin_value

                                fee_percent
                            }

                            privileges{
                                rec_id
                                privilege_type
                                value
                            }

                        }
                    }
                `,
                contextValue: req || null,
            });

            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });


            const users: User[] = result.data.connectedUsers as User[];

            return Promise.resolve(users);

        } catch (error) {
            return Promise.reject(error);
        }


    }




    async getUser(params: { id: string, connected_account: string }, req?: Request): Promise<User> {

        try {

            const users: User[] = await this.getList(params, req || null);
            if (users.length === 0)
                return Promise.resolve(null);


            return Promise.resolve(users[0] as User);

        } catch (error) {
            return Promise.reject(error);
        }

    }




    async userExists(params: { id: string, connected_account: string }): Promise<boolean> {

        try {

            const result = await mysql.query(`
                SELECT
                    id
                FROM
                    users
                WHERE
                    id = :id AND
                    connected_account = :connected_account
            `, params);


            if (result.rowsCount === 0)
                return Promise.resolve(false);


            return Promise.resolve(true);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class ConnectedUsersDeleteUserService {


    async deleteUser(params: { id: string, connected_account: string }): Promise<void> {

        try {

            const result = await mysql.query(`DELETE FROM users WHERE id = :id AND connected_account = :connected_account`, params);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}





class ConnectedUsersPostAddService {


    async addNewUser(data: User, connected_account_id: string): Promise<string> {

        try {

            const user_id = accountUserIDGenerator.getNewUSER();



            const result = await mysql.query(`
                INSERT INTO
                    users
                SET
                    id = :id,
                    first_name = :first_name,
                    last_name = :last_name,
                    email = :email,
                    username = :username,
                    phone = :phone,
                    connected_account = :connected_account,
                    role = :role
            `, {
                id: user_id,
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                username: data.username,
                phone: data.phone,
                connected_account: connected_account_id,
                role: data.role
            });



            return Promise.resolve(user_id);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class ConnectedUsersPutUpdateService {


    async updateUserMainData(user: User, params: { id: string, connected_account: string }): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    users
                SET
                    first_name = :first_name,
                    last_name = :last_name,
                    email = :email,
                    username = :username,
                    phone = :phone,
                    role = :role
                WHERE
                    id = :id AND
                    connected_account = :connected_account;
            `, {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                username: user.username,
                phone: user.phone,
                role: user.role,
                id: params.id,
                connected_account: params.connected_account,
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class ConnectedUsersPrivilegesGetList {


    async getPrivileges(params: { user_id: string, connected_account_id: string }, req?: Request): Promise<UserPrivilege[]> {


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
                        userPrivileges${graphQueryParams !== '()' ? graphQueryParams : ''}{
                            rec_id
                            privilege_type
                            value
                        }
                    }
                `,
                contextValue: req || null,
            });

            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });



            const user_privileges: UserPrivilege[] = result.data.userPrivileges as UserPrivilege[];


            return Promise.resolve(user_privileges);


        } catch (error) {
            return Promise.reject(error);
        }


    }


}





class ConnectedUsersPrivilegesUpdate {


    async updateUserPrivileges(user_privileges: UserPrivilege[], params: { id: string, connected_account: string }): Promise<void> {

        try {

            let sql_update_query = '';
            for (const privilege of user_privileges)
                if (privilege.rec_id)
                    sql_update_query += `
                        UPDATE
                            user_privileges
                        SET
                            value = ${privilege.value ? 1 : 0}
                        WHERE
                            rec_id = '${privilege.rec_id}' AND
                            user_id = :id AND
                            connected_account_id = :connected_account;
                    `;
                else
                    sql_update_query += `
                        INSERT INTO
                            user_privileges
                        SET
                            rec_id = '${accountUserIDGenerator.getNewUserPrivilegeID()}',
                            privilege_type = '${privilege.privilege_type}',
                            value = ${privilege.value ? 1 : 0},
                            user_id = '${params.id}',
                            connected_account_id = '${params.connected_account}';
                    `;



            const result = await mysql.query(sql_update_query, params);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




const connectedUsersGetListService = new ConnectedUsersGetListService();
const connectedUsersDeleteUserService = new ConnectedUsersDeleteUserService();
const connectedUsersPrivilegesGetList = new ConnectedUsersPrivilegesGetList();
const connectedUsersPutUpdateService = new ConnectedUsersPutUpdateService();
const connectedUsersPostAddService = new ConnectedUsersPostAddService();
const connectedUsersPrivilegesUpdate = new ConnectedUsersPrivilegesUpdate();
export {
    connectedUsersGetListService, connectedUsersDeleteUserService, connectedUsersPrivilegesGetList, connectedUsersPostAddService,
    connectedUsersPutUpdateService, connectedUsersPrivilegesUpdate
};
