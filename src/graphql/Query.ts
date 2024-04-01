import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, graphqlSync } from 'graphql';
import { mysql } from '../lib/connectors/mysql';
import { isEmpty } from 'lodash';
import { utils } from '../lib/utils.service';

// import types
import { OrderType } from './types/OrderType';
import { ProductType } from './types/ProductType';
import { OrderSentEmailType } from './types/OrderSentEmailType';
import { OrderConfirmationType } from './types/email-templates/OrderConfirmationType';
import { ProductImagesType } from './types/ProductImagesType';
import { ContactType } from './types/ContactType';
import { ContactLabelType } from './types/ContactLabelType';
import { ContactAddressType } from './types/ContactAddressType';
import { ContactCustomFieldType } from './types/ContactCustomFieldType';
import { ContactEmailType } from './types/ContactEmailType';
import { ContactPhoneType } from './types/ContactPhoneType';
import { ContactLabelNameType } from './types/ContactLabelNameType';
import { NewsletterClientEmail } from './types/NewsletterEmailLIstObjectType';
import { CompanyDataType } from './types/CompanyDataType';
import { CompanyEmailDataType } from './types/CompanyEmailDataType';
import { NewsletterType } from './types/NewsletterMessageType';
import { NewsletterMessagesHistoryClientsEmailListsType } from './types/NewsletterMessagesHistoryClientsEmailListsType';
import { CompanyAPIConnectionsKeyType } from './types/CompanyAPIConnectionsKeyType';
import { EmployeeDonePaymentsType } from './types/EmployeeDonePaymentsType';
import { EmployeePaymentType } from './types/EmployeePaymentType';
import { EmployeeWorkedHoursType } from './types/EmployeeWorkedHoursType';
import { EmployeeInfoType } from './types/EmployeeInfoType';
import { OrderPaymentMethodType } from './types/OrderPaymentMethodType';
import { ProductCategoryType } from './types/ProductCategoryType';
import { UserType } from './types/UserType';
import { UserPrivilegeType } from './types/UserPrivilegeType';
import { ProductTransactionsType } from './types/ProductTransactionsType';
import { ProductStockType } from './types/ProductStockType';
import { OrderTransactionType } from './types/OrderTransactionType';
import { CompanyWarehouseType } from './types/CompanyWarehouseType';
import { CompanyWarehouseRunwayType } from './types/CompanyWarehouseRunwaysType';
import { CompanyWarehouseColumnType } from './types/CompanyWarehouseColumnType';
import { CompanyWarehouseColumnShelfType } from './types/CompanyWarehouseColumnShelfType';
import { ProductInventoryType } from './types/ProductInventoryType';
import { ProductInventorySettingsType } from './types/ProductInventorySettingsType';




// tslint:disable-next-line:variable-name
const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({

        orders: {
            type: new GraphQLList(OrderType),
            args: {
                order_id: { type: GraphQLString },
                first_name: { type: GraphQLString },
                last_name: { type: GraphQLString },
                address: { type: GraphQLString },
                postal_code: { type: GraphQLString },
                city: { type: GraphQLString },
                country: { type: GraphQLString },
                phone: { type: GraphQLString },
                cell_phone: { type: GraphQLString },
                confirmed: { type: GraphQLBoolean },
                sent: { type: GraphQLBoolean },
                completed: { type: GraphQLBoolean },
                transfer_courier: { type: GraphQLString },
                current_status: { type: GraphQLString },
                invoice_data__company: { type: GraphQLString },
                invoice_data__tax_number: { type: GraphQLString },
                invoice_data__doy: { type: GraphQLString },
                invoice_data__address: { type: GraphQLString },
                invoice_data__postal_code: { type: GraphQLString },
                invoice_data__city: { type: GraphQLString },
                invoice_data__country: { type: GraphQLString },
                invoice_data__phone: { type: GraphQLString },
                invoice_data__cell_phone: { type: GraphQLString },
                invoice_data__is_valid: { type: GraphQLBoolean },
                payment_type: { type: GraphQLString },
                connected_account_id: { type: GraphQLString },
                order_number: { type: GraphQLString },
                invoice_data__invoice_number: { type: GraphQLString },
                page: { type: GraphQLInt }
            },
            resolve: async (record, args, context, info) => {

                try {

                    const queryParams: { limit: number; offset: number } = { limit: 100, offset: 0 };

                    if (args?.page || context?.query?.page) { // page = 3

                        const page: number = args.page ? args.page : context?.query?.page ? parseInt(context.query.page) : 1;

                        if (page <= 1)
                            queryParams.offset = 0;
                        else
                            queryParams.offset = (page - 1) * queryParams.limit;

                        delete args.page;

                    }


                    let queryWhereClause = '';


                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (args[key] !== null && args[key] !== 'null')
                                if (typeof args[key] === 'number')
                                    queryWhereClause += `AND ${key} = ${args[key]}`;
                                else
                                    queryWhereClause += `AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }



                    const result = await mysql.query(`
                        SELECT
                        *
                        FROM
                            orders
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}

                        ORDER BY confirm_date DESC
                        LIMIT :limit
                        offset :offset
                    `, {
                        limit: queryParams.limit,
                        offset: queryParams.offset
                    });

                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },



        orderTransactions: {
            type: new GraphQLList(OrderTransactionType),
            args: {
                order_id: { type: GraphQLString },
                connected_account_id: { type: GraphQLString },
                page: { type: GraphQLInt },
            },
            resolve: async (record, args, context, info) => {

                try {

                    const queryParams: { limit: number; offset: number } = { limit: 30, offset: 0 };

                    if (args?.page || context?.query?.page) { // page = 3

                        const page: number = args.page ? args.page : context?.query?.page ? parseInt(context.query.page) : 1;

                        if (page <= 1)
                            queryParams.offset = 0;
                        else
                            queryParams.offset = (page - 1) * queryParams.limit;

                        delete args.page;

                    }



                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            orders_transactions
                        WHERE
                            order_id = :order_id AND
                            connected_account_id = :connected_account_id

                        ORDER BY created_at DESC
                        LIMIT :limit
                        offset :offset
                    `, {
                        order_id: args.order_id,
                        connected_account_id: args.connected_account_id,
                        limit: queryParams.limit,
                        offset: queryParams.offset,
                    });



                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },




        orderSearch: {
            type: new GraphQLList(OrderType),
            args: {
                order_id: { type: GraphQLString },
                order_number: { type: GraphQLString },
                first_name: { type: GraphQLString },
                last_name: { type: GraphQLString },
                phone: { type: GraphQLString },
                email: { type: GraphQLString },
                connected_account_id: { type: GraphQLString },
                page: { type: GraphQLInt },
                limit: { type: GraphQLInt }
            },
            resolve: async (record, args, context, info) => {

                try {

                    const queryParams: { limit: number; offset: number } = { limit: args?.limit || 100, offset: 0 };

                    if (args?.page || context?.query?.page) { // page = 3

                        const page: number = args.page ? args.page : context?.query?.page ? parseInt(context.query.page) : 1;

                        if (page <= 1)
                            queryParams.offset = 0;
                        else
                            queryParams.offset = (page - 1) * queryParams.limit;

                        delete args.page;
                        delete args.limit;

                    }


                    let queryWhereClause = '';


                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (args[key] !== null && args[key] !== 'null')
                                if (typeof args[key] === 'number')
                                    queryWhereClause += ` AND ${key} = ${args[key]}`;
                                else
                                    if (key !== 'connected_account_id')
                                        queryWhereClause += ` AND ${key} LIKE '%%${args[key]}%%'`;
                                    else
                                        queryWhereClause += ` AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{5}/g, '');

                    }



                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            orders
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}

                        ORDER BY confirm_date DESC
                        LIMIT :limit
                        offset :offset
                    `, {
                        limit: queryParams.limit,
                        offset: queryParams.offset
                    });


                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },


        products: {
            type: new GraphQLList(ProductType),
            args: {
                product_id: { type: GraphQLString },
                headline: { type: GraphQLString },
                product_brand: { type: GraphQLString },
                categories_belongs: { type: GraphQLString },
                product_code: { type: GraphQLString },
                product_model: { type: GraphQLString },
                supplier: { type: GraphQLString },
                current_status: { type: GraphQLString },
                connected_account_id: { type: GraphQLString },
                page: { type: GraphQLInt },
            },
            resolve: async (record, args, context, info) => {

                try {

                    const queryParams: { limit: number; offset: number } = { limit: 100, offset: 0 };

                    if (args?.page || context?.query?.page) { // page = 3

                        const page: number = args.page ? args.page : context?.query?.page ? parseInt(context.query.page) : 1;

                        if (page <= 1)
                            queryParams.offset = 0;
                        else
                            queryParams.offset = (page - 1) * queryParams.limit;

                        delete args.page;

                    }


                    let queryWhereClause = '';


                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (key !== 'categories_belongs')
                                if (typeof args[key] === 'number')
                                    queryWhereClause += `AND ${key} = ${args[key]} `;
                                else
                                    queryWhereClause += `AND ${key} = '${args[key]}'`;
                            else {
                                const categories = JSON.parse(args.categories_belongs);
                                for (const category of categories)
                                    queryWhereClause += `AND categories_belongs LIKE '%%"${category}":""%${categories[category]}%'`;
                            }
                        // queryWhereClause += `AND ${ key } LIKE '%%":"%${args[key]}",%%'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }


                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            products
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}

                        ORDER BY created_at DESC
                        LIMIT :limit
                        offset :offset
                    `, {
                        limit: queryParams.limit,
                        offset: queryParams.offset
                    });



                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },


        productSearch: {
            type: new GraphQLList(ProductType),
            args: {
                product_code: { type: GraphQLString },
                headline: { type: GraphQLString },
                product_brand: { type: GraphQLString },
                product_model: { type: GraphQLString },
                connected_account_id: { type: GraphQLString },
                page: { type: GraphQLInt },
                limit: { type: GraphQLInt },
            },
            resolve: async (record, args, context, info) => {

                try {

                    const queryParams: { limit: number; offset: number } = { limit: args?.limit || 100, offset: 0 };

                    if (args?.page || context?.query?.page) { // page = 3

                        const page: number = args.page ? args.page : context?.query?.page ? parseInt(context.query.page) : 1;

                        if (page <= 1)
                            queryParams.offset = 0;
                        else
                            queryParams.offset = (page - 1) * queryParams.limit;

                        delete args.page;
                        delete args.limit;

                    }


                    let queryWhereClause = '';


                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (args[key] !== null && args[key] !== 'null')
                                if (typeof args[key] === 'number')
                                    queryWhereClause += ` AND ${key} = ${args[key]}`;
                                else
                                    if (key !== 'connected_account_id')
                                        queryWhereClause += ` AND ${key} LIKE '%%${args[key]}%%'`;
                                    else
                                        queryWhereClause += ` AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{5}/g, '');

                    }




                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            products
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}

                        ORDER BY CASE
                            WHEN current_status = 'in_stock' THEN 1
                            WHEN current_status = 'available_1_to_3_days' THEN 2
                            WHEN current_status = 'available_1_to_10_days' THEN 3
                            WHEN current_status = 'available_1_to_30_days' THEN 4
                            WHEN current_status = 'with_order' THEN 5
                            WHEN current_status = 'unavailable' THEN 6
                            WHEN current_status = 'temporary_unavailable' THEN 7
                            WHEN current_status = 'out_of_stock' THEN 8
                            WHEN current_status = 'ended' THEN 9
                            WHEN current_status = 'closed' THEN 10
                        END ASC
                        LIMIT :limit
                        offset :offset
                    `, {
                        limit: queryParams.limit,
                        offset: queryParams.offset
                    });


                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },


        productImages: {
            type: new GraphQLList(ProductImagesType),
            args: {
                id: { type: GraphQLString },
                main_image: { type: GraphQLBoolean },
                product_id: { type: GraphQLString },
                connected_account_id: { type: GraphQLString },
            },
            resolve: async (record, args, context, info) => {

                try {

                    let queryWhereClause = '';


                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (typeof args[key] === 'number')
                                queryWhereClause += `AND ${key} = ${args[key]} `;
                            else
                                queryWhereClause += `AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }


                    const result = await mysql.query(`
                SELECT
                    *
                    FROM
                product_images_storage
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}
                `);

                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },


        productCategories: {
            type: new GraphQLList(ProductCategoryType),
            args: {
                pcategory_id: { type: GraphQLString },
                label: { type: GraphQLString },
                connected_account_id: { type: GraphQLString },
            },
            resolve: async (record, args, context, info) => {

                try {

                    let queryWhereClause = '';


                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (typeof args[key] === 'number')
                                queryWhereClause += `AND ${key} = ${args[key]} `;
                            else
                                queryWhereClause += `AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }


                    const result = await mysql.query(`
                SELECT
                    *
                    FROM
                product_categories
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}
                `);

                    return result.rows;

                } catch (error) {
                    return [];
                }

            }

        },


        productTransactions: {
            type: new GraphQLList(ProductTransactionsType),
            args: {
                product_id: { type: GraphQLString },
                connected_account_id: { type: GraphQLString },
                page: { type: GraphQLInt }
            },
            resolve: async (record, args, context, info) => {

                try {

                    const queryParams: { limit: number; offset: number } = { limit: 30, offset: 0 };

                    if (args?.page || context?.query?.page) { // page = 3

                        const page: number = args.page ? args.page : context?.query?.page ? parseInt(context.query.page) : 1;

                        if (page <= 1)
                            queryParams.offset = 0;
                        else
                            queryParams.offset = (page - 1) * queryParams.limit;

                        delete args.page;

                    }



                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            products_transactions
                        WHERE
                            product_id = :product_id AND
                            connected_account_id = :connected_account_id

                        ORDER BY created_at DESC
                        LIMIT :limit
                        offset :offset
                    `, {
                        product_id: args.product_id,
                        connected_account_id: args.connected_account_id,
                        limit: queryParams.limit,
                        offset: queryParams.offset
                    });



                    return result.rows;


                } catch (error) {
                    return [];
                }

            }
        },



        // product stock
        productStock: {
            type: new GraphQLList(ProductStockType),
            args: {
                product_id: { type: GraphQLString },
                connected_account_id: { type: GraphQLString },
            },
            resolve: async (record, args, context, info) => {

                try {

                    let queryWhereClause = '';
                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (key !== 'categories_belongs')
                                if (typeof args[key] === 'number')
                                    queryWhereClause += `AND ${key} = ${args[key]} `;
                                else
                                    queryWhereClause += `AND ${key} = '${args[key]}'`;
                            else {
                                const categories = JSON.parse(args.categories_belongs);
                                for (const category of categories)
                                    queryWhereClause += `AND categories_belongs LIKE '%%"${category}":""%${categories[category]}%'`;
                            }
                        // queryWhereClause += `AND ${ key } LIKE '%%":"%${args[key]}",%%'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }



                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            product_stock_warehouses
                        WHERE
                            ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}
                    `);


                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },



        famousProducts: {
            type: new GraphQLList(ProductType),
            args: {
                products: { type: new GraphQLList(GraphQLString) },
                connected_account_id: { type: GraphQLString },
            },
            resolve: async (record, args, context, info) => {

                try {

                    let queryWhereClause = '';

                    for (const product_id of args.products)
                        queryWhereClause += ` OR product_id = '${product_id}'`;

                    queryWhereClause = queryWhereClause.replace(/^.{3}/g, '');
                    queryWhereClause = `(${queryWhereClause})`;



                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            products
                        WHERE
                            connected_account_id = :connected_account_id AND
                            ${queryWhereClause}
                    `, { connected_account_id: args.connected_account_id });


                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },




        orderSentEmail: {
            type: new GraphQLList(OrderSentEmailType),
            args: {
                order_id: { type: GraphQLString },
                order_number: { type: GraphQLString },
                connected_account_id: { type: GraphQLString },
            },
            resolve: async (record, args, context, info) => {

                let queryWhereClause = '';


                if (args && !isEmpty(args)) {

                    for (const key in args)
                        if (typeof args[key] === 'number')
                            queryWhereClause += `AND ${key} = ${args[key]} `;
                        else
                            queryWhereClause += `AND ${key} = '${args[key]}'`;

                    queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                }


                const result = await mysql.query(`
                SELECT
                    *
                    FROM
                order_products
                    ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}
                `);

                return result.rows;

            }
        },



        orderConfirmationCompanyData: {
            type: new GraphQLList(OrderConfirmationType),
            args: {
                connected_account_id: { type: GraphQLString },      // required
            },
            resolve: async (record, args, context, info) => {

                if (!args?.connected_account_id)
                    return false;


                const result = await mysql.query(`
                SELECT
                shop_logo,
                    shop_url,
                    shop_name,
                    shop_google_rate_url
                FROM
                companies
                WHERE
                connected_account_id = : connected_account_id;
                `, {
                    connected_account_id: args.connected_account_id,
                });

                return result.rows;

            }
        },



        // contacts
        contacts: {
            type: new GraphQLList(ContactType),
            args: {
                contact_id: { type: GraphQLString },
                connected_account_id: { type: GraphQLString },
                name: { type: GraphQLString },
                father_name: { type: GraphQLString },
                surname: { type: GraphQLString },
                mother_name: { type: GraphQLString },
                alias: { type: GraphQLString },
                company: { type: GraphQLString },
                work_position_title: { type: GraphQLString },
                contact_label_id: { type: GraphQLString },
                contact_label_str: { type: GraphQLString },
                phone_number: { type: GraphQLString },
                contact_email: { type: GraphQLString },
                private: { type: GraphQLInt },
                private_user_id: { type: GraphQLString },
                favorite: { type: GraphQLInt },
                page: { type: GraphQLInt },
            },
            resolve: async (record, args, context, info) => {

                try {

                    // const queryParams: { limit: number; offset: number } = { limit: 100, offset: 0 };

                    // if (args?.page || context?.query?.page) { // page = 3

                    //     const page: number = args.page ? args.page : context?.query?.page ? parseInt(context.query.page) : 1;

                    //     if (page <= 1)
                    //         queryParams.offset = 0;
                    //     else
                    //         queryParams.offset = (page - 1) * queryParams.limit;

                    //     delete args.page;

                    // }


                    delete args.page;



                    let queryWhereClause = '';

                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (key !== 'contact_id' && key !== 'connected_account_id' && key !== 'private_user_id')
                                if (typeof args[key] === 'number')
                                    queryWhereClause += ` AND ${key} = ${args[key]} `;
                                else
                                    queryWhereClause += ` AND ${key} LIKE '%${args[key]}&'`;
                            else
                                queryWhereClause += ` AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }

                    // do something for contact labels
                    let additional_result = null;
                    if (args?.contact_label_id) {

                        additional_result = await mysql.query(`
                            SELECT
                            contact_id
                            FROM
                            contact_labels
                            WHERE
                            label_id = :label_id AND
                            connected_account_id = : connected_account_id
                        `, {
                            label_id: args.contact_label_id,
                            connected_account_id: args.connected_account_id
                        });

                        for (const row in additional_result.rows)
                            queryWhereClause += `AND contact_id = '${additional_result.rows[row].contact_id}`;

                    }
                    if (args?.contact_label_str) {

                        additional_result = await mysql.query(`
                            SELECT
                                contact_id
                            FROM
                                contact_labels
                            WHERE
                                label_id = (SELECT
                                                label_id
                                            FROM
                                                contact_labels_name
                                            WHERE
                                                label = :label AND
                                                connected_account_id = :connected_account_id)
                            AND
                                connected_account_id = :connected_account_id
                        `, {
                            label: args.contact_label_str,
                            connected_account_id: args.connected_account_id,
                        });

                        for (const row in additional_result.rows)
                            queryWhereClause += `AND contact_id = '${additional_result.rows[row].contact_id}`;

                    }
                    if (args?.phone_number) {

                        additional_result = await mysql.query(`
                            SELECT
                                contact_id
                            FROM
                                contacts_phone_data
                            WHERE
                                phone LIKE '%${args.phone_number}%', AND
                                connected_account_id = :connected_account_id
                        `, { connected_account_id: args.connected_account_id });

                        for (const row in additional_result.rows)
                            queryWhereClause += `AND contact_id = '${additional_result.rows[row].contact_id}`;

                    }
                    if (args?.contact_email) {

                        additional_result = await mysql.query(`
                            SELECT
                                contact_id
                            FROM
                                contacts_email_data
                            WHERE
                                value LIKE '%${args.contact_email}%' AND
                                connected_account_id = :connected_account_id
                        `, { connected_account_id: args.connected_account_id });

                        for (const row in additional_result.rows)
                            queryWhereClause += `AND contact_id = '${additional_result.rows[row].contact_id}`;

                    }




                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            contacts
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}
                    `);


                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },

        contactLabels: {
            type: new GraphQLList(ContactLabelType),
            args: {
                rec_id: { type: GraphQLString },
                label_id: { type: GraphQLString },
                connected_account_id: { type: GraphQLString },
                contact_id: { type: GraphQLString },
            },
            resolve: async (record, args, context, info) => {

                try {

                    let queryWhereClause = '';


                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (typeof args[key] === 'number')
                                queryWhereClause += `AND ${key} = ${args[key]}`;
                            else
                                queryWhereClause += `AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }


                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            contact_labels
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}
                    `);


                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },


        contactLabelsNames: {
            type: new GraphQLList(ContactLabelNameType),
            args: {
                label_id: { type: GraphQLString },
                connected_account_id: { type: GraphQLString }
            },
            resolve: async (record, args, context, info) => {

                try {

                    let queryWhereClause = '';


                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (typeof args[key] === 'number')
                                queryWhereClause += `AND ${key} = ${args[key]}`;
                            else
                                queryWhereClause += `AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }


                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            contact_labels_names
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}
                    `);

                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },


        contactAddresses: {
            type: new GraphQLList(ContactAddressType),
            args: {
                rec_id: { type: GraphQLString },
                country: { type: GraphQLString },
                connected_account_id: { type: GraphQLString },
                contact_id: { type: GraphQLString },
            },
            resolve: async (record, args, context, info) => {

                try {

                    let queryWhereClause = '';


                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (typeof args[key] === 'number')
                                queryWhereClause += `AND ${key} = ${args[key]}`;
                            else
                                queryWhereClause += `AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }


                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            contacts_address_data
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}
                    `);


                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },



        contactCustomFields: {
            type: new GraphQLList(ContactCustomFieldType),
            args: {
                rec_id: { type: GraphQLString },
                connected_account_id: { type: GraphQLString },
                contact_id: { type: GraphQLString },
            },
            resolve: async (record, args, context, info) => {

                try {

                    let queryWhereClause = '';


                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (typeof args[key] === 'number')
                                queryWhereClause += `AND ${key} = ${args[key]}`;
                            else
                                queryWhereClause += `AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }



                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            contacts_custom_fields
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}
                    `);


                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },



        contactEmails: {
            type: new GraphQLList(ContactEmailType),
            args: {
                rec_id: { type: GraphQLString },
                connected_account_id: { type: GraphQLString },
                contact_id: { type: GraphQLString },
            },
            resolve: async (record, args, context, info) => {

                try {

                    let queryWhereClause = '';


                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (typeof args[key] === 'number')
                                queryWhereClause += `AND ${key} = ${args[key]}`;
                            else
                                queryWhereClause += `AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }


                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            contacts_email_data
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}
                    `);


                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },



        contactPhones: {
            type: new GraphQLList(ContactPhoneType),
            args: {
                rec_id: { type: GraphQLString },
                connected_account_id: { type: GraphQLString },
                contact_id: { type: GraphQLString },
            },
            resolve: async (record, args, context, info) => {

                try {

                    let queryWhereClause = '';

                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (typeof args[key] === 'number')
                                queryWhereClause += `AND ${key} = ${args[key]}`;
                            else
                                queryWhereClause += `AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }


                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            contacts_phone_data
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}
                    `);


                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },




        // company data
        company_data: {
            type: new GraphQLList(CompanyDataType),
            args: {
                connected_account_id: { type: GraphQLString }
            },
            resolve: async (record, args, context, info) => {

                try {

                    let queryWhereClause = '';
                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (typeof args[key] === 'number')
                                queryWhereClause += `AND ${key} = ${args[key]}`;
                            else
                                queryWhereClause += `AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }



                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            companies
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}
                    `);


                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },




        // company emails
        companyEmails: {
            type: new GraphQLList(CompanyEmailDataType),
            args: {
                email_id: { type: GraphQLString },
                connected_account_id: { type: GraphQLString },
            },
            resolve: async (record, args, context, info) => {

                try {

                    let queryWhereClause = '';

                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (typeof args[key] === 'number')
                                queryWhereClause += `AND ${key} = ${args[key]}`;
                            else
                                queryWhereClause += `AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }


                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            company_email_data
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}
                    `);

                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },








        // newsletter configs
        newsletterMessages: {
            type: new GraphQLList(NewsletterType),
            args: {
                message_id: { type: GraphQLString },
                connected_account_id: { type: GraphQLString },
            },
            resolve: async (record, args, context, info) => {

                try {

                    let queryWhereClause = '';

                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (typeof args[key] === 'number')
                                queryWhereClause += `AND ${key} = ${args[key]}`;
                            else
                                queryWhereClause += `AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }


                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            newsletter_history
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}
                    `);


                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },

        newsletterClientsEmails: {                  // client emails

            type: new GraphQLList(NewsletterClientEmail),
            args: {
                rec_id: { type: GraphQLString },
                connected_account_id: { type: GraphQLString },
            },
            resolve: async (record, args, context, info) => {

                try {

                    let queryWhereClause = '';

                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (typeof args[key] === 'number')
                                queryWhereClause += `AND ${key} = ${args[key]}`;
                            else
                                queryWhereClause += `AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }


                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            newsletter_clients_email
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}
                    `);

                    return result.rows;

                } catch (error) {
                    return [];
                }

            }

        },

        newsletterMessageHistoryClientsEmailLists: {

            type: new GraphQLList(NewsletterMessagesHistoryClientsEmailListsType),
            args: {
                rec_id: { type: GraphQLString },
                connected_account_id: { type: GraphQLString },
                message_id: { type: GraphQLString },
                email_id: { type: GraphQLString }
            },
            resolve: async (record, args, context, info) => {

                try {

                    let queryWhereClause = '';

                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (typeof args[key] === 'number')
                                queryWhereClause += `AND ${key} = ${args[key]}`;
                            else
                                queryWhereClause += `AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }


                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            newsletter_messages_history_clients_email_lists
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}
                    `);

                    return result.rows;

                } catch (error) {
                    return [];
                }

            }

        },





        // public api - tokens
        companyAPIConnectionsKeys: {
            type: new GraphQLList(CompanyAPIConnectionsKeyType),
            args: {
                token_id: { type: GraphQLString },
                connected_account_id: { type: GraphQLString }
            },
            resolve: async (record, args, context, info) => {

                try {

                    let queryWhereClause = '';

                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (typeof args[key] === 'number')
                                queryWhereClause += `AND ${key} = ${args[key]}`;
                            else
                                queryWhereClause += `AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }


                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            account_tokens
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}
                    `);


                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },





        // employees
        employeeInfo: {
            type: new GraphQLList(EmployeeInfoType),
            args: {
                employee_id: { type: GraphQLString },
                first_name: { type: GraphQLString },
                middle_name: { type: GraphQLString },
                last_name: { type: GraphQLString },
                fathers_name: { type: GraphQLString },
                mothers_name: { type: GraphQLString },
                mother_last_name: { type: GraphQLString },
                tax_id: { type: GraphQLString },
                social_security_number_amka: { type: GraphQLString },
                phone_number: { type: GraphQLString },
                email: { type: GraphQLString },
                status: { type: GraphQLString },
                connected_account_id: { type: GraphQLString },
                page: { type: GraphQLInt },
            },
            resolve: async (record, args, context, info) => {

                try {

                    const queryParams: { limit: number; offset: number } = { limit: 100, offset: 0 };

                    if (args?.page || context?.query?.page) { // page = 3

                        const page: number = args.page ? args.page : context?.query?.page ? parseInt(context.query.page) : 1;

                        if (page <= 1)
                            queryParams.offset = 0;
                        else
                            queryParams.offset = (page - 1) * queryParams.limit;

                        delete args.page;

                    }


                    let queryWhereClause = '';

                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (typeof args[key] === 'number')
                                queryWhereClause += `AND ${key} = ${args[key]}`;
                            else
                                queryWhereClause += `AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }


                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            employee_info
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}

                        LIMIT :limit OFFSET :offset
                    `, {
                        limit: queryParams.limit,
                        offset: queryParams.offset
                    });

                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },

        employeeDonePayments: {
            type: new GraphQLList(EmployeeDonePaymentsType),
            args: {
                rec_id: { type: GraphQLString },
                employee_id: { type: GraphQLString },
                connected_account_id: { type: GraphQLString },
                payment_version_id: { type: GraphQLString },
                payment_date_time: { type: GraphQLString },
            },
            resolve: async (record, args, context, info) => {

                try {

                    let queryWhereClause = '';

                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (typeof args[key] === 'number')
                                queryWhereClause += `AND ${key} = ${args[key]}`;
                            else
                                queryWhereClause += `AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }


                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            employee_done_payments
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}
                    `);

                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },

        employeePayments: {
            type: new GraphQLList(EmployeePaymentType),
            args: {
                rec_id: { type: GraphQLString },
                employee_id: { type: GraphQLString },
                connected_account_id: { type: GraphQLString },
                version_label: { type: GraphQLString },
            },
            resolve: async (record, args, context, info) => {

                try {

                    let queryWhereClause = '';

                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (typeof args[key] === 'number')
                                queryWhereClause += `AND ${key} = ${args[key]}`;
                            else
                                queryWhereClause += `AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }


                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            employee_payments
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}
                    `);


                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },

        employeeWorkedHours: {
            type: new GraphQLList(EmployeeWorkedHoursType),
            args: {
                rec_id: { type: GraphQLString },
                employee_id: { type: GraphQLString },
                connected_account_id: { type: GraphQLString },
                date_day: { type: GraphQLString },
                status: { type: GraphQLString }
            },
            resolve: async (record, args, context, info) => {

                try {

                    let queryWhereClause = '';

                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (typeof args[key] === 'number')
                                queryWhereClause += `AND ${key} = ${args[key]}`;
                            else
                                queryWhereClause += `AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }


                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            employee_worked_hours
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}
                    `);


                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },





        orderPaymentMethods: {
            type: new GraphQLList(OrderPaymentMethodType),
            args: {
                rec_id: { type: GraphQLString },
                active: { type: GraphQLInt },
                archived: { type: GraphQLInt }
            },
            resolve: async (record, args, context, info) => {

                try {

                    let queryWhereClause = '';

                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (typeof args[key] === 'number')
                                queryWhereClause += ` AND ${key} = ${args[key]}`;
                            else
                                queryWhereClause += ` AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }



                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            order_payment_types
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}
                    `);


                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },



        companyData: {
            type: new GraphQLList(CompanyDataType),
            args: {
                rec_id: { type: GraphQLString },
                connected_account_id: { type: GraphQLString }
            },
            resolve: async (record, args, context, info) => {

                try {

                    let queryWhereClause = '';

                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (typeof args[key] === 'number')
                                queryWhereClause += ` AND ${key} = ${args[key]}`;
                            else
                                queryWhereClause += ` AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }



                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            companies
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}
                    `);


                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },




        // users connected with an account
        connectedUsers: {
            type: new GraphQLList(UserType),
            args: {
                id: { type: GraphQLString },
                connected_account: { type: GraphQLString }
            },
            resolve: async (record, args, context, info) => {

                try {

                    let queryWhereClause = '';

                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (typeof args[key] === 'number')
                                queryWhereClause += ` AND ${key} = ${args[key]}`;
                            else
                                queryWhereClause += ` AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }



                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            users
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}
                    `);


                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },

        // user's privileges
        userPrivileges: {
            type: new GraphQLList(UserPrivilegeType),
            args: {
                user_id: { type: GraphQLString },
                connected_account_id: { type: GraphQLString }
            },
            resolve: async (record, args, context, info) => {

                try {

                    let queryWhereClause = '';

                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (typeof args[key] === 'number')
                                queryWhereClause += ` AND ${key} = ${args[key]}`;
                            else
                                queryWhereClause += ` AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }



                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            user_privileges
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}
                    `);


                    return result.rows;


                } catch (error) {
                    return [];
                }

            }
        },





        // warehouses of the companies
        companyWarehouses: {
            type: new GraphQLList(CompanyWarehouseType),
            args: {
                warehouse_id: { type: GraphQLString },
                connected_account_id: { type: GraphQLString }
            },
            resolve: async (record, args, context, info) => {

                try {

                    let queryWhereClause = '';

                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (typeof args[key] === 'number')
                                queryWhereClause += ` AND ${key} = ${args[key]}`;
                            else
                                queryWhereClause += ` AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }


                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            company_warehouses
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}
                    `);


                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },

        companyWarehousesRunways: {
            type: new GraphQLList(CompanyWarehouseRunwayType),
            args: {
                runway_id: { type: GraphQLString },
                warehouse_id: { type: GraphQLString },
                connected_account_id: { type: GraphQLString }
            },
            resolve: async (record, args, context, info) => {

                try {

                    let queryWhereClause = '';

                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (typeof args[key] === 'number')
                                queryWhereClause += ` AND ${key} = ${args[key]}`;
                            else
                                queryWhereClause += ` AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }


                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            company_warehouses__runways
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}
                    `);


                    return result.rows;

                } catch (error) {
                    return [];
                }
            }
        },

        companyWarehousesColumns: {
            type: new GraphQLList(CompanyWarehouseColumnType),
            args: {
                column_id: { type: GraphQLString },
                connected_account_id: { type: GraphQLString },
                warehouse_id: { type: GraphQLString },
                column_name: { type: GraphQLString },
                runway_id: { type: GraphQLString },
            },
            resolve: async (record, args, context, info) => {

                try {

                    let queryWhereClause = '';

                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (typeof args[key] === 'number')
                                queryWhereClause += ` AND ${key} = ${args[key]}`;
                            else
                                queryWhereClause += ` AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }


                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            company_warehouses__columns
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}
                    `);


                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },

        companyWarehouseColumnsShelf: {
            type: new GraphQLList(CompanyWarehouseColumnShelfType),
            args: {
                shelf_id: { type: GraphQLString },
                connected_account_id: { type: GraphQLString },
                warehouse_id: { type: GraphQLString },
                runway_id: { type: GraphQLString },
                column_id: { type: GraphQLString },
            },
            resolve: async (record, args, context, info) => {

                try {

                    let queryWhereClause = '';

                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (typeof args[key] === 'number')
                                queryWhereClause += ` AND ${key} = ${args[key]}`;
                            else
                                queryWhereClause += ` AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }


                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            company_warehouses__column_shelfs
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}
                    `);


                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },




        // product inventories
        productInventories: {
            type: new GraphQLList(ProductInventoryType),
            args: {
                connected_account_id: { type: GraphQLString },
                inventory_id: { type: GraphQLString },
                page: { type: GraphQLInt }
            },
            resolve: async (record, args, context, info) => {

                try {


                    const queryParams: { limit: number; offset: number } = { limit: 100, offset: 0 };

                    if (args?.page || context?.query?.page) { // page = 3

                        const page: number = args.page ? args.page : context?.query?.page ? parseInt(context.query.page) : 1;

                        if (page <= 1)
                            queryParams.offset = 0;
                        else
                            queryParams.offset = (page - 1) * queryParams.limit;

                        delete args.page;

                    }


                    let queryWhereClause = '';


                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (args[key] !== null && args[key] !== 'null')
                                if (typeof args[key] === 'number')
                                    queryWhereClause += `AND ${key} = ${args[key]}`;
                                else
                                    queryWhereClause += `AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }



                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            product_inventory_overview
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}

                        ORDER BY created_at DESC
                        LIMIT :limit
                        offset :offset
                    `, {
                        limit: queryParams.limit,
                        offset: queryParams.offset
                    });

                    return result.rows;


                } catch (error) {
                    return [];
                }

            }
        },



        productInventoriesSettings: {
            type: new GraphQLList(ProductInventorySettingsType),
            args: {
                connected_account_id: { type: GraphQLString },
            },
            resolve: async (record, args, context, info) => {

                try {


                    let queryWhereClause = '';


                    if (args && !isEmpty(args)) {

                        for (const key in args)
                            if (args[key] !== null && args[key] !== 'null')
                                if (typeof args[key] === 'number')
                                    queryWhereClause += `AND ${key} = ${args[key]}`;
                                else
                                    queryWhereClause += `AND ${key} = '${args[key]}'`;

                        queryWhereClause = queryWhereClause.replace(/^.{4}/g, '');

                    }



                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            product_inventories_settings
                        ${!queryWhereClause ? '' : `WHERE ${queryWhereClause}`}
                    `);

                    return result.rows;


                } catch (error) {
                    return [];
                }

            }
        }

    })

});

export { QueryType };
