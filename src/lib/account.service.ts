import { Request } from 'express';
import {
    UserMergingData, User, Account, AccountUserBasicImportantCommonData, AccountRegistrationData,
    UserRegistrationData, GenerateTokenToChangePassword, SavedSessionDataFromDB, SaveDataFromLoginSession
} from '../models';
import { utils } from '../lib/utils.service';
import { mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import * as jwt from 'jsonwebtoken';
import { accountUserIDGenerator } from './id_numbers_generators/account-user';


class AuthenticationLoginService {

    async getUser(data: { username?: string, email?: string, phone?: string }): Promise<UserMergingData> {

        try {

            let queryWhereClause = '';

            for (const key in data)
                queryWhereClause += `AND ${key} = '${data[key]}'`;

            queryWhereClause = queryWhereClause.replace(/^.{4}/g, ''); // e.g. -> AND user_id = 'usr_oj34n5jk34'

            const result = await mysql.query(`SELECT * FROM users_merging WHERE ${queryWhereClause}`);

            if (result.rowsCount === 0)
                return Promise.resolve(null);

            const user = new UserMergingData(result.rows[0]);
            return Promise.resolve(user);

        } catch (error) {
            return Promise.reject(error);
        }

    }


    async getUserDataFromUserType(data: { id?: string, username?: string, email?: string, phone?: string }, type: 'common_data' | 'all_data_user' | 'all_data_account', data_tbl: 'accounts' | 'users'): Promise<AccountUserBasicImportantCommonData | Account | User> {

        try {

            let queryWhereClause = '';
            for (const key in data)
                queryWhereClause += `AND ${key} = '${data[key]}'`;

            queryWhereClause = queryWhereClause.replace(/^.{4}/g, ''); // e.g. -> AND user_id = 'usr_oj34n5jk34'

            let result = null;
            if (type === 'common_data')
                result = await mysql.query(`
                                SELECT
                                    id,
                                    first_name,
                                    last_name,
                                    email,
                                    username,
                                    password,
                                    phone,
                                    profile_picture_url,
                                    activated,
                                    request_password_change,
                                    created_at,
                                    role,
                                    authentication_2fa__app,
                                    authentication_2fa__email,
                                    authentication_2fa__app_secret
                                FROM
                                    ${data_tbl}
                                WHERE
                                    ${queryWhereClause};
                `);
            else
                result = await mysql.query(`
                                SELECT
                                    *
                                FROM
                                    ${data_tbl}
                                WHERE
                                    ${queryWhereClause};
                `);


            if (result === 0)
                return Promise.resolve(null);


            let account = null;
            if (type === 'common_data')
                account = new AccountUserBasicImportantCommonData(result.rows[0]);
            else if (type === 'all_data_user')
                account = new User(result.rows[0]);
            else
                account = new Account(result.rows[0]);


            return Promise.resolve(account);

        } catch (error) {
            return Promise.reject(error);
        }

    }


    async checkIfUserIsVerified(data: { id?: string, account_id?: string, username?: string, email?: string, phone?: string }, data_tbl: 'accounts' | 'users'): Promise<boolean> {

        try {

            let queryWhereClause = '';

            for (const key in data)
                queryWhereClause += `AND ${key} = '${data[key]}'`;

            queryWhereClause = queryWhereClause.replace(/^.{4}/g, ''); // e.g. -> AND user_id = 'usr_oj34n5jk34'

            const result = await mysql.query(`SELECT activated FROM ${data_tbl} WHERE ${queryWhereClause}`);

            if (result.rowsCount === 0)
                return Promise.resolve(null);

            return Promise.resolve(result.rows[0]);

        } catch (error) {
            return Promise.reject(error);
        }

    }


    async connectedAccountToUser(data: { id?: string, username?: string, email?: string, phone?: string }): Promise<string> {

        try {

            let queryWhereClause = '';

            for (const key in data)
                queryWhereClause += `AND ${key} = '${data[key]}'`;

            queryWhereClause = queryWhereClause.replace(/^.{4}/g, ''); // e.g. -> AND user_id = 'usr_oj34n5jk34'

            const result = await mysql.query(`SELECT connected_account FROM users WHERE ${queryWhereClause}`);

            if (result.rowsCount === 0)
                return Promise.resolve(null);

            return Promise.resolve(result.rows[0].connected_account.toString());

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async accountUsingBizyhiveCloud(data: { id?: string, username?: string, email?: string, phone?: string }): Promise<boolean> {

        try {

            let queryWhereClause = '';

            for (const key in data)
                queryWhereClause += `AND ${key} = '${data[key]}'`;

            queryWhereClause = queryWhereClause.replace(/^.{4}/g, ''); // e.g. -> AND user_id = 'usr_oj34n5jk34'

            const result = await mysql.query(`
                SELECT
                    using_bizyhive_cloud
                FROM
                    accounts
                WHERE
                    ${queryWhereClause}
            `);


            if (result.rowsCount === 0)
                return Promise.resolve(null);

            return Promise.resolve(result.rows[0] as boolean);

        } catch (error) {
            return Promise.reject(error);
        }

    }

}


class AuthChecksGeneral {

    async userExists(data: { user_id?: string, username?: string, email?: string, phone?: string, except_id?: string }): Promise<boolean> {

        let queryWhereClause = '';

        for (const key in data)
            if (key !== 'except_id')
                queryWhereClause += `AND ${key} = '${data[key]}'`;

        queryWhereClause = queryWhereClause.replace(/^.{4}/g, ''); // e.g. -> AND user_id = 'usr_oj34n5jk34'

        const result = await mysql.query(`
                SELECT
                    id
                FROM
                    users_merging
                WHERE
                    ${data?.except_id ? `user_id <> '${data.except_id}' AND` : ``}
                    ${queryWhereClause};
        `);

        if (result.rowsCount === 0)
            return Promise.resolve(false);

        return Promise.resolve(true);

    }

}


class GenerateData {

    getWebToken(data: { user_id: string, username: string, email: string, account_type: string, type: string }): string {

        return jwt.sign(
            {
                user_id: data.user_id,
                username: data.username,
                email: data.email,
                account_type: data.account_type,
                type: data.type,
            },
            config.SECRET_KEY_FOR_ACTIVATION_LINK,
            { expiresIn: '7 days' },
        );

    }

    getNewId(type: string): string {
        if (type === 'account')
            return accountUserIDGenerator.getNewIdACCOUNT();
        else if (type === 'user')
            return accountUserIDGenerator.getNewUSER();
    }

}


class RegistrationService {

    checkPassword(password: string): boolean {

        try {

            const isUpperCase = new RegExp(/(?=.*[A-Z])/g);
            const isSpecialChar = new RegExp(/(?=.*[!@#$%^&*])/g);
            const isLowerCase = new RegExp(/(?=.*[a-z])/g);
            const isNumeric = new RegExp(/(?=.*[0-9])/g);

            if (password.match(isUpperCase) && password.match(isSpecialChar) && password.match(isLowerCase) && password.match(isNumeric))
                return true;

            return false;

        } catch (error) {
            return error;
        }

    }


    async insertNewAccount(account: AccountRegistrationData): Promise<string> {

        try {

            const new_id = generateData.getNewId('account');

            const result = await mysql.query(`
                INSERT INTO
                    accounts
                SET
                    id = :new_id,
                    first_name = :first_name,
                    last_name = :last_name,
                    email = :email,
                    username = :username,
                    password = :password,
                    phone = :phone,
                    company_name = :company_name,
                    role = :role,
                    using_bizyhive_cloud = :using_bizyhive_cloud;
            `, {
                new_id: new_id,
                first_name: account.first_name,
                last_name: account.last_name,
                email: account.email,
                username: account.username,
                password: utils.generateHash(account.password),
                phone: account.phone,
                company_name: account.company_name,
                role: account.role,
                using_bizyhive_cloud: account.using_bizyhive_cloud,
            });

            await this.insertNewUserAccountCommonTbl({ user_id: new_id, username: account.username, email: account.email, phone: account.phone, connected_table: 'accounts' });

            return Promise.resolve(new_id);

        } catch (error) {
            return Promise.reject(error);
        }

    }


    async insertNewUser(user: UserRegistrationData): Promise<string> {

        try {

            const new_id = generateData.getNewId('user');

            const result = await mysql.query(`
                INSERT INTO
                    users
                SET
                    id = :user_id,
                    first_name = :first_name,
                    last_name = :last_name,
                    email = :email,
                    username = :username,
                    password = :password,
                    phone = :phone,
                    connected_account = :connected_account,
                    is_account = 0,
                    role = :role
            `, {
                user_id: new_id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                username: user.username,
                password: utils.generateHash(user.password),
                phone: user.phone,
                connected_account: user.connected_account,
                role: user.role,
            });

            await this.insertNewUserAccountCommonTbl({ user_id: new_id, username: user.username, email: user.email, phone: user.phone, connected_table: 'users' });

            return Promise.resolve(new_id);

        } catch (error) {
            return Promise.reject(error);
        }

    }





    async insertNewUserAccountCommonTbl(data: UserMergingData): Promise<void> {

        try {

            const result = await mysql.query(`
                INSERT INTO
                    users_merging
                SET
                    user_id = :user_id,
                    username = :username,
                    email = :email,
                    phone = :phone,
                    connected_table = :connected_table
            `, {
                user_id: data.user_id,
                username: data.username,
                email: data.email,
                phone: data.phone,
                connected_table: data.connected_table,
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }

}


class EmailActivationService {

    checkIfKeyExpires(data: { expDate: number }): boolean {

        try {

            if (utils.convertToEpoch(new Date().toString()) > data.expDate)
                return true;

            return false;

        } catch (error) {
            return error;
        }

    }


    async userIsActivated(data: { id?: string, username?: string, email?: string }, account_type: string): Promise<boolean> {

        try {
            let queryWhereClause = '';

            for (const key in data)
                queryWhereClause += `AND ${key} = '${data[key]}'`;

            queryWhereClause = queryWhereClause.replace(/^.{4}/g, ''); // e.g. -> AND user_id = 'usr_oj34n5jk34'


            const result = await mysql.query(`
            SELECT
                activated
            FROM
                ${account_type}
            WHERE
                ${queryWhereClause} AND
                activated = 1;
        `);

            if (result.rowsCount === 0)
                return Promise.resolve(false);

            return Promise.resolve(true);
        } catch (error) {
            return Promise.reject(error);
        }

    }


    async activateUser(data: { id?: string, username?: string, email?: string }, account_type: string): Promise<void> {

        try {

            let queryWhereClause = '';

            for (const key in data)
                queryWhereClause += `AND ${key} = '${data[key]}'`;

            queryWhereClause = queryWhereClause.replace(/^.{4}/g, ''); // e.g. -> AND user_id = 'usr_oj34n5jk34'

            const result = await mysql.query(`
                UPDATE
                    ${account_type}
                SET
                    activated = 1
                WHERE
                    ${queryWhereClause};
            `);

        } catch (error) {
            return Promise.reject(error);
        }

    }

}


class RequestNewPassword {

    async accountData(data: { account_id: string, account_type: string, data: string }): Promise<any> {

        try {

            const result = await mysql.query(`
                SELECT
                    ${data.data}
                FROM
                    ${data.account_type}s
                WHERE
                    id = :account_id
            `, { account_id: data.account_id });

            if (result.rowsCount === 0)
                return Promise.resolve(null);

            return Promise.resolve(result.rows[0][data.data]);

        } catch (error) {
            return Promise.reject(error);
        }

    }

    async findDataToGenerateToken(data: { username?: string, email?: string }): Promise<GenerateTokenToChangePassword> {

        try {

            let data_tbl: string;
            if (data?.username) data_tbl = await this.findAccountTypeTBL({ username: data.username });
            else data_tbl = await this.findAccountTypeTBL({ email: data.email });

            let queryWhereClause = '';

            for (const key in data)
                queryWhereClause += `AND ${key} = '${data[key]}'`;

            queryWhereClause = queryWhereClause.replace(/^.{4}/g, ''); // e.g. -> AND user_id = 'usr_oj34n5jk34'


            const result = await mysql.query(`
                SELECT
                    id,
                    username,
                    email
                FROM
                    ${data_tbl}
                WHERE
                    ${queryWhereClause};
            `);

            if (result.rowsCount === 0)
                return Promise.resolve(null);

            const object = new GenerateTokenToChangePassword(result.rows[0]);
            if (data_tbl === 'accounts') object.account_type = 'account';
            else if (data_tbl === 'users') object.account_type = 'user';


            return Promise.resolve(object);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async findAccountTypeTBL(data: { username?: string, email?: string }): Promise<string> {

        try {

            let queryWhereClause = '';

            for (const key in data)
                queryWhereClause += `AND ${key} = '${data[key]}'`;

            queryWhereClause = queryWhereClause.replace(/^.{4}/g, ''); // e.g. -> AND user_id = 'usr_oj34n5jk34'

            const result = await mysql.query(`
                SELECT
                    connected_table
                FROM
                    users_merging
                WHERE
                    ${queryWhereClause};
            `);


            if (result.rowsCount === 0)
                return Promise.resolve(null);

            return Promise.resolve(result.rows[0].connected_table);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async changeStatusInDBRequestNewPassword(data: { username?: string, email?: string }, account_type: string): Promise<void> {

        try {

            let queryWhereClause = '';

            for (const key in data)
                queryWhereClause += `AND ${key} = '${data[key]}'`;

            queryWhereClause = queryWhereClause.replace(/^.{4}/g, ''); // e.g. -> AND user_id = 'usr_oj34n5jk34'

            const result = await mysql.query(`
                UPDATE
                    ${account_type}s
                SET
                    request_password_change = 1
                WHERE
                    ${queryWhereClause};
            `);

        } catch (error) {
            return Promise.resolve(error);
        }

    }



    async checkIfUserWantPasswordChange(data: { username?: string, email?: string }, account_type: string): Promise<boolean> {

        try {

            let queryWhereClause = '';

            for (const key in data)
                queryWhereClause += `AND ${key} = '${data[key]}'`;

            queryWhereClause = queryWhereClause.replace(/^.{4}/g, ''); // e.g. -> AND user_id = 'usr_oj34n5jk34'

            const result = await mysql.query(`
                SELECT
                    request_password_change
                FROM
                    ${account_type}s
                WHERE
                    ${queryWhereClause};
            `);

            if (result.rowsCount === 0)
                return Promise.resolve(false);

            return Promise.resolve(result.rows[0] as boolean);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async changeRequestNewPasswordStatusDisable(user_id: string, account_type: string): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    ${account_type}s
                SET
                    request_password_change = 0
                WHERE
                    id = :id
            `, {
                id: user_id,
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }


    async changePassword(user_id: string, password: string, account_type: string): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    ${account_type}s
                SET
                    password = :password
                WHERE
                    id = :id
            `, {
                password: utils.generateHash(password),
                id: user_id,
            });


        } catch (error) {
            return Promise.reject(error);
        }

    }



}






class SessionDataGetService {


    async getSessionData(user_id: string): Promise<SavedSessionDataFromDB> {

        try {

            const result = await mysql.query(`
                SELECT
                    *
                FROM
                    sessions
                WHERE
                    data LIKE '%{"user_id":":user_id",%' AND
                    data LIKE '%,"created_at":":date"}%'
            `, {
                user_id: user_id,
                date: new Date().toLocaleString().split(',')[0].split('/').join('-')
            });


            if (result.rowsCount === 0)
                return Promise.resolve(null);


            return Promise.resolve({
                sid: result.rows[0].sid as string,
                expires: result.rows[0].expires as number,
                data: result.rows[0].data as string
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }


}






class AddGeolocationLogInDataService {


    async addData(data: SaveDataFromLoginSession): Promise<void> {

        try {

            const result = await mysql.query(`
                INSERT INTO
                    login_sessions
                SET
                    login_id = :login_id,
                    connected_account_id = :connected_account_id,
                    user_account_id = :user_account_id,
                    session_id = :session_id,
                    expires = :expires,
                    session_data = :session_data,
                    country_code = :country_code,
                    country_name = :country_name,
                    city = :city,
                    postal = :postal,
                    latitude = :latitude,
                    longitude = :longitude,
                    ipv4 = :ipv4,
                    ipv6 = :ipv6,
                    state = :state,
                    using_bizyhive_cloud = :using_bizyhive_cloud
            `, {
                login_id: data.login_id,
                connected_account_id: data.connected_account_id,
                user_account_id: data.user_account_id,
                session_id: data.session_id,
                expires: data.expires,
                session_data: data.session_data,
                country_code: data.country_code,
                country_name: data.country_name,
                city: data.city,
                postal: data.postal,
                latitude: data.latitude,
                longitude: data.longitude,
                ipv4: data.ipv4,
                ipv6: data.ipv6,
                state: data.state,
                using_bizyhive_cloud: data.using_bizyhive_cloud
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }


}









const authenticationLoginService = new AuthenticationLoginService();
const authChecksGeneral = new AuthChecksGeneral();
const registrationService = new RegistrationService();
const generateData = new GenerateData();
const emailActivationService = new EmailActivationService();
const requestNewPassword = new RequestNewPassword();
const sessionDataGetService = new SessionDataGetService();
const addGeolocationLogInDataService = new AddGeolocationLogInDataService();
export {
    authenticationLoginService, authChecksGeneral, registrationService, generateData, emailActivationService,
    requestNewPassword, sessionDataGetService, addGeolocationLogInDataService
};
