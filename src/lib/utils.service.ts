import { Request, Response, NextFunction, query } from 'express';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { customAlphabet } from 'nanoid';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment-timezone';
import * as lodash from 'lodash';
import * as path from 'path';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
require('dotenv').config();

import { AccountToken } from '../models';
import * as speakeasy from 'speakeasy';




class Utils {

    public moment = moment;
    public lodash = lodash;
    public path = path;
    public fs = fs;
    public speakeasy = speakeasy;



    /** Generates hashed version of a string (e.g. hash of user's password)  */
    generateHash(value: string): string {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(value, salt);
        return hash;
    }


    /** Generate random id */
    generateId(length: number, alphabet: string): string {

        const nanoid = customAlphabet(alphabet, length);
        return nanoid();

    }



    /** Middleware function for checking if user's session exist */
    checkAuth(req: Request, res: Response, next: NextFunction) {

        // if (config.unauthorized_routes_allowed.includes(req.path))
        //     return next();

        if (!req.session?.user?.user_id)
            return res.status(401).send({ code: 401, type: 'unauthorized', message: 'Please sign in' });

        next();

    }



    /** Middleware function for checking if the user's token is correct  */
    async checkAuthToken(req: Request, res: Response, next: NextFunction) {

        const token = req.body.token || req.params.token || req.headers['x-access-token'];
        if (!token)
            return res.status(403).send({
                code: 403,
                type: 'no_token_found',
                message: 'A token is required for authentication',
            });


        const decoded_token: AccountToken = jwt.verify(token, process.env.SECRET_KEY_FOR_API_TOKEN);
        if (!decoded_token?.token_id || !decoded_token?.connected_account_id && !decoded_token?.token_value
            || !decoded_token?.products_open || !decoded_token?.product_categories_open || !decoded_token?.newsletter_open
            || !decoded_token?.cart_checkout_open)
            return res.status(400).send({
                code: 400,
                type: 'missing_data',
                message: 'Missing data from token key. Wrong token key!',
            });


        const mysql_query_result = await mysql.query(`
            SELECT
                *
            FROM
                account_tokens
            WHERE
                token_id = :token_id AND
                connected_account_id = :connected_account_id AND
                token_value = :token_value AND
                products_open = :products_open AND
                product_categories_open = :product_categories_open AND
                newsletter_open = :newsletter_open AND
                cart_checkout_open = :cart_checkout_open;
        `, {
            token_id: decoded_token.token_id,
            connected_account_id: decoded_token.connected_account_id,
            token_value: decoded_token.token_value,
            products_open: decoded_token.products_open,
            product_categories_open: decoded_token.product_categories_open,
            newsletter_open: decoded_token.newsletter_open,
            cart_checkout_open: decoded_token.cart_checkout_open
        });


        if (decoded_token.products_open)
            if (config.open_api_routes.products_open.includes(req.path))
                return next();

        if (decoded_token.product_categories_open)
            if (config.open_api_routes.product_categories_open.includes(req.path))
                return next();

        if (decoded_token.newsletter_open)
            if (config.open_api_routes.newsletter_open.includes(req.path))
                return next();

        if (decoded_token.cart_checkout_open)
            if (config.open_api_routes.cart_checkout_open.includes(req.path))
                return next();


        return res.status(401).send({
            code: 401,
            type: 'unauthorized',
            message: 'Token key is unauthorized to have access in this system',
        });

    }


    /** Return true if text is email address */
    isEmail(text: string): boolean {

        const emailRegExp = new RegExp(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,50}$/gm);

        return emailRegExp.test(text);

    }


    convertToEpoch(dateString: string): number {
        const dateParts = dateString.split('/');
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 0; // JavaScript months are zero-based
        const day = parseInt(dateParts[2]);

        const date = new Date(year, month, day);
        let epoch = date.getTime();



        if (epoch < 0)
            epoch = epoch * (-1);

        return epoch;
    }



    isValidDate(dateString: string, include_time: boolean): boolean {

        let date_format_checker = null;
        if (include_time)
            date_format_checker = new RegExp(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/);
        else
            date_format_checker = new RegExp(/(\d{2})\/(\d{2})\/(\d{4})/);


        return date_format_checker.test(dateString);

    }




    convertToEpochDateTime(dateString: string, date_moment: 'day_start' | 'day_end' | 'full_time'): number {

        let new_date = '';
        if (date_moment === 'day_start')
            new_date = `${dateString} 00:00:00`;
        else if (date_moment === 'day_end')
            new_date = `${dateString} 23:59:59`;
        else if (date_moment === 'full_time')
            new_date = dateString;


        if (!this.isValidDate(new_date, true))
            return null;

        const epoch = utils.moment(new_date).unix();

        return epoch;

    }




    findAccountIDFromSessionObject(req: Request): string {
        if (req.session.user.account_type === 'account')
            return req.session.user.user_id;
        else if (req.session.user.account_type === 'user')
            return req.session.user.connected_account;
    }



    findAccountIdDecodeTokenVerification(token: string): string {

        const decoded_token: AccountToken = jwt.verify(token, process.env.SECRET_KEY_FOR_API_TOKEN);
        return decoded_token.connected_account_id;

    }




    async getActivatedAccounts(): Promise<string[]> {

        try {

            const result = await mysql.query(`SELECT id, created_at FROM accounts WHERE activated=1`);

            const accounts: string[] = [];
            for (let i = 0; i < result.rowsCount; i++)
                accounts.push(result.rows[i].id as string);

            return accounts;

        } catch (error) {
            return Promise.reject(error);
        }

    }



    /** Function to initialize the created_at query by type and the current date (from today's date) */
    createQueryInitializeDateRange(data: { date_range: string, table_column: string, start_date?: string, end_date?: string, date?: string }): string {

        const date = new Date().toLocaleDateString();           // 11/30/2004

        if (data.date_range === 'yearly') {
            const year = date.split('/')[2].toString();

            return `${data.table_column} LIKE '%%${year}-%%'`;
        } else if (data.date_range === 'monthly') {
            const splitted_date = date.split('/');    // ['11', '30', '2004] --> [month, day, year]
            if (splitted_date[0].toString().length === 1)
                splitted_date[0].replace(splitted_date[0], `0${splitted_date[0]}`);

            return `${data.table_column} LIKE '%%${splitted_date[2]}-${splitted_date[0]}%%'`;
        } else if (data.date_range === 'weekly') {
            const start_date = utils.moment().startOf('week').toDate().toLocaleDateString().split('/');            // 10/1/2023 --> ['10', '1', '2023'], Sunday
            const end_date = utils.moment().endOf('week').toDate().toLocaleDateString().split('/');                // 10/7/2023 --> ['10', '7', '2023'], Saturday

            const dates: string[][] = [];
            dates.push(start_date);

            if (start_date[0] === end_date[0])
                for (let i = Number(start_date[1]) + 1; i < Number(end_date[1]); i++) {
                    if (start_date[0].toString().length === 1)
                        start_date[0].replace(start_date[0], `0${start_date[0]}`);

                    let temp_date = [];
                    if (i < 10)
                        temp_date = `${start_date[0]}/0${i}/${start_date[2]}`.split('/');
                    else
                        temp_date = `${start_date[0]}/${i}/${start_date[2]}`.split('/');

                    dates.push(temp_date);
                }
            else {
                const date_of_month = utils.moment().endOf('month').toDate().toLocaleDateString().split('/');
                for (let i = Number(start_date[1]); i <= Number(date_of_month[1]); i++) {
                    if (start_date[0].toString().length === 1)
                        start_date[0].replace(start_date[0], `0${start_date[0]}`);

                    let temp_date = [];
                    if (i < 10)
                        temp_date = `${start_date[0]}/0${i}/${start_date[2]}`.split('/');
                    else
                        temp_date = `${start_date[0]}/${i}/${start_date[2]}`.split('/');


                    dates.push(temp_date);
                }

                for (let i = 1; i < Number(end_date[1]); i++) {
                    if (end_date[0].toString().length === 1)
                        end_date[0].replace(end_date[0], `0${end_date[0]}`);

                    let temp_date = [];
                    if (i < 10)
                        temp_date = `${end_date[0]}/0${i}/${end_date[2]}`.split('/');
                    else
                        temp_date = `${end_date[0]}/${i}/${end_date[2]}`.split('/');


                    dates.push(temp_date);
                }
            }

            dates.push(end_date);


            let where_query = ``;
            for (let i = 0; i < dates.length; i++)
                where_query += ` AND ${data.table_column} LIKE '%%${dates[i][2]}-${dates[i][0]}-${dates[i][1]}%%'`;

            where_query = where_query.replace(/^.{4}/g, '');

            return where_query;
        } else if (data.date_range === 'range') {

            if (!data?.start_date || !data?.end_date)
                return null;

            if (!utils.moment(data.start_date, 'MM/DD/YYYY', true).isValid()
                || !utils.moment(data.end_date, 'MM/DD/YYYY', true).isValid())
                return null;


            const start_date_array = data.start_date.split('/');
            const end_date_array = data.end_date.split('/');


            const dates: string[][] = [];
            dates.push(start_date_array);

            if (start_date_array[0] === end_date_array[0])
                for (let i = Number(start_date_array[1]) + 1; i < Number(end_date_array[1]); i++) {
                    if (start_date_array[0].toString().length === 1)
                        start_date_array[0].replace(start_date_array[0], `0${start_date_array[0]}`);

                    let temp_date = [];
                    if (i < 10)
                        temp_date = `${start_date_array[0]}/0${i}/${start_date_array[2]}`.split('/');
                    else
                        temp_date = `${start_date_array[0]}/${i}/${start_date_array[2]}`.split('/');

                    dates.push(temp_date);
                }
            else {
                const date_of_month = utils.moment().endOf('month').toDate().toLocaleDateString().split('/');
                for (let i = Number(start_date_array[1]); i <= Number(date_of_month[1]); i++) {
                    if (start_date_array[0].toString().length === 1)
                        start_date_array[0].replace(start_date_array[0], `0${start_date_array[0]}`);

                    let temp_date = [];
                    if (i < 10)
                        temp_date = `${start_date_array[0]}/0${i}/${start_date_array[2]}`.split('/');
                    else
                        temp_date = `${start_date_array[0]}/${i}/${start_date_array[2]}`.split('/');


                    dates.push(temp_date);
                }

                for (let i = 1; i < Number(end_date_array[1]); i++) {
                    if (end_date_array[0].toString().length === 1)
                        end_date_array[0].replace(end_date_array[0], `0${end_date_array[0]}`);

                    let temp_date = [];
                    if (i < 10)
                        temp_date = `${end_date_array[0]}/0${i}/${end_date_array[2]}`.split('/');
                    else
                        temp_date = `${end_date_array[0]}/${i}/${end_date_array[2]}`.split('/');


                    dates.push(temp_date);
                }
            }

            dates.push(end_date_array);


            let where_query = ``;
            for (let i = 0; i < dates.length; i++)
                where_query += ` AND ${data.table_column} LIKE '%%${dates[i][2]}-${dates[i][0]}-${dates[i][1]}%%'`;

            where_query = where_query.replace(/^.{4}/g, '');

            return where_query;
        } else if (data.date_range === 'day') {
            if (!data?.date)
                return null;

            if (!utils.moment(data.date, 'MM/DD/YYYY', true).isValid())
                return null;

            const new_date = data.date.split('/');

            return `created_at '%%${new_date[2]}-${new_date[0]}-${new_date[1]}%%'`;
        }

        return ``;

    }




    /** Function to initialize the created_at query by type and the current date (given date) */
    createQueryInitializeDateRangeByDateType(data: { type: string, date: string, table_column: string }): string {

        if (data.type === 'yearly') {

            const splitted_date = data.date.split('/');
            return ` ${data.table_column} LIKE '%%${splitted_date[2]}-%%'`;

        } else if (data.type === 'monthly') {

            const splitted_date = data.date.split('/');
            if (splitted_date[0].toString().length === 1)
                splitted_date[0].replace(splitted_date[0], `0${splitted_date[0]}`);


            return ` ${data.table_column} LIKE '%%${splitted_date[2]}-${splitted_date[0]}%%'`;

        } else if (data.type === 'weekly') {

            const weekNumber = utils.moment(data.date, 'MM/DD/YYYY').week();
            const splitted_date = data.date.split('/');
            const limit_dates = {
                start_day: utils.moment({ y: Number(splitted_date[2]) }).week(weekNumber).startOf('week').toDate().toLocaleDateString().split('/'),
                end_day: utils.moment({ y: Number(splitted_date[2]) }).week(weekNumber).endOf('week').toDate().toLocaleDateString().split('/')
            };

            const dates: string[][] = [];
            dates.push(limit_dates.start_day);

            if (limit_dates.start_day[0] === limit_dates.end_day[0])
                for (let i = Number(limit_dates.start_day[1]) + 1; i < Number(limit_dates.end_day[1]); i++) {
                    if (limit_dates.start_day[0].toString().length === 1)
                        limit_dates.start_day[0].replace(limit_dates.start_day[0], `0${limit_dates.start_day[0]}`);

                    let temp_date = [];
                    if (i < 10)
                        temp_date = `${limit_dates.start_day[0]}/0${i}/${limit_dates.start_day[2]}`.split('/');
                    else
                        temp_date = `${limit_dates.start_day[0]}/${i}/${limit_dates.start_day[2]}`.split('/');

                    dates.push(temp_date);
                }
            else {
                const date_of_month = utils.moment().endOf('month').toDate().toLocaleDateString().split('/');
                for (let i = Number(limit_dates.start_day[1]); i <= Number(date_of_month[1]); i++) {
                    if (limit_dates.start_day[0].toString().length === 1)
                        limit_dates.start_day[0].replace(limit_dates.start_day[0], `0${limit_dates.start_day[0]}`);

                    let temp_date = [];
                    if (i < 10)
                        temp_date = `${limit_dates.start_day[0]}/0${i}/${limit_dates.start_day[2]}`.split('/');
                    else
                        temp_date = `${limit_dates.start_day[0]}/${i}/${limit_dates.start_day[2]}`.split('/');


                    dates.push(temp_date);
                }

                for (let i = 1; i < Number(limit_dates.end_day[1]); i++) {
                    if (limit_dates.end_day[0].toString().length === 1)
                        limit_dates.end_day[0].replace(limit_dates.end_day[0], `0${limit_dates.end_day[0]}`);

                    let temp_date = [];
                    if (i < 10)
                        temp_date = `${limit_dates.end_day[0]}/0${i}/${limit_dates.end_day[2]}`.split('/');
                    else
                        temp_date = `${limit_dates.end_day[0]}/${i}/${limit_dates.end_day[2]}`.split('/');


                    dates.push(temp_date);
                }
            }

            dates.push(limit_dates.end_day);


            let where_query = ``;
            for (let i = 0; i < dates.length; i++)
                where_query += ` AND ${data.table_column} LIKE '%%${dates[i][2]}-${dates[i][0]}-${dates[i][1]}%%'`;

            where_query = where_query.replace(/^.{4}/g, '');

            return where_query;

        }


    }





    /**
     * Function to initialize the created_at query by type and the current date,
     * give back a query for numeric (created_at > one_number AND created_at < second_number)
     */
    createQueryInitializeDateRangeByUnixEpochDate(data: {
        type: 'yearly' | 'monthly' | 'weekly' | 'day' | string,
        date: string,
        table_column: string
    }): string {

        if (!this.isValidDate(data.date, false))
            return null;



        const dateParts = data.date.split('/');

        let new_dates = null;
        if (data.type === 'yearly')
            new_dates = {
                start_date: `1/1/${dateParts[2]}`,
                last_date: `12/31/${dateParts[2]}`,
            };
        else if (data.type === 'monthly')
            new_dates = {
                start_date: moment(data.date).startOf('month').format('MM/DD/YYYY'),
                last_date: moment(data.date).endOf('month').format('MM/DD/YYYY'),
            };
        else if (data.type === 'weekly')
            new_dates = {
                start_date: moment(data.date).startOf('week').format('MM/DD/YYYY'),
                last_date: moment(data.date).endOf('week').format('MM/DD/YYYY'),
            };
        else if (data.type === 'day')
            new_dates = {
                start_date: moment(data.date).format('MM/DD/YYYY'),
                last_date: moment(data.date).format('MM/DD/YYYY'),
            };


        const query_where_clause = `
            ${data.table_column} >= ${this.convertToEpochDateTime(new_dates.start_date, 'day_start')} AND
            ${data.table_column} <= ${this.convertToEpochDateTime(new_dates.last_date, 'day_end')}
        `;

        return query_where_clause;

    }






    /** Generate 6 digit code for email 2FA authentication */
    email2FactorAuthenticationGenerate6DigitCode(): string {
        return this.generateId(6, config.nanoid_alphabet);
    }



    /** find differences between 2 strings
     * NOTE: Length if both strings must be equal or the new string must be longer (str2)
     * @params str1
     * @params str2
     */
    findDifferencesString(str1: string, str2: string): string {
        let diff = '';
        let str1_counter = 0;
        str2.split('').forEach((val) => {
            if (val !== str1.charAt(str1_counter))
                diff += val;
            else
                str1_counter++;
        });

        return diff;
    }





    /** Function to save and visualizing the errors given from the backend */
    async errorHandlingReturn(error_object: any, res: Response): Promise<Response> {

        try {

            const result = await mysql.query(`
                INSERT INTO
                    system_errors
                SET
                    error_code = :error_code,
                    error_metadata = :error_metadata
            `, {
                error_code: error_object?.code?.toString() || '500',
                error_metadata: JSON.stringify(error_object)
            });

        } catch (error) {
            if (process.env.ENVIRONMENT_MODE === 'development') console.log(error);


            return res.status(500).send({
                code: 500,
                type: 'cannot_connect_to_the_db',
                message: 'Cannot connect to the DB',
            });
        }


        if (process.env.ENVIRONMENT_MODE === 'development') console.log(error_object);

        return res.status(Number(error_object?.code) || 500).send(error_object);

    }



}

const utils = new Utils();
export { utils };
