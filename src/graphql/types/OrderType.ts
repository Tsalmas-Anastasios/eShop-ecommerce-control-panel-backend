import { Order, OrderProductIdentifiers, OrderProductDetails } from '../../models';
import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';
import { ordersList } from '../../lib/orders.service';

import { OrderPaymentMethodType } from './OrderPaymentMethodType';
import { OrderProductIdentifiersType } from './OrderProductIdentifiersType';
import { TransferCourierType } from './TransferCourierType';
import { CompanyDataType } from './CompanyDataType';



// tslint:disable-next-line:variable-name
const OrderType = new GraphQLObjectType({
    name: 'OrderType',
    fields: () => ({

        order_id: { type: GraphQLString },
        proof: { type: GraphQLString },
        email: { type: GraphQLString },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        address: { type: GraphQLString },
        postal_code: { type: GraphQLString },
        city: { type: GraphQLString },
        country: { type: GraphQLString },
        phone: { type: GraphQLString },
        cell_phone: { type: GraphQLString },
        confirm_date: { type: GraphQLString },
        sent_date: { type: GraphQLString },
        completed_date: { type: GraphQLString },
        archived_date: { type: GraphQLString },
        returned_date: { type: GraphQLString },
        confirmed: { type: GraphQLBoolean },
        sent: { type: GraphQLBoolean },
        completed: { type: GraphQLBoolean },

        transfer_courier: { type: GraphQLString },
        transfer_courier_details: {
            type: TransferCourierType,
            resolve: async (order: Order, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            transfer_couriers
                        WHERE
                            rec_id = :rec_id
                    `, { rec_id: order.transfer_courier });


                    for (const row of result.rows)
                        if (row.data && typeof row.data === 'string')
                            row.data = JSON.parse(row.data);

                    return result.rows[0];

                } catch (error) {
                    return [];
                }

            }
        },

        current_status: { type: GraphQLString },
        invoice_data__first_name: { type: GraphQLString },
        invoice_data__last_name: { type: GraphQLString },
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
        payment_type_details: {
            type: OrderPaymentMethodType,
            resolve: async (order: Order, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            order_payment_types
                        WHERE
                            rec_id = :rec_id
                    `, { rec_id: order.payment_type });

                    for (const row of result.rows)
                        if (row.data && typeof row.data === 'string')
                            row.data = JSON.parse(row.data);

                    return result.rows[0];

                } catch (error) {
                    return [];
                }

            }
        },

        connected_account_id: { type: GraphQLString },
        order_number: { type: GraphQLString },
        invoice_data__invoice_number: { type: GraphQLString },
        archived: { type: GraphQLString },

        // costs
        clear_value: { type: GraphQLFloat },
        transportation: { type: GraphQLFloat },
        cash_on_delivery_payment: { type: GraphQLBoolean },
        cash_on_delivery: { type: GraphQLFloat },
        extra_fees: { type: GraphQLBoolean },
        extra_fees_costs: { type: GraphQLFloat },
        fees: { type: GraphQLFloat },
        fee_percent: { type: GraphQLFloat },
        order_total: { type: GraphQLFloat },

        // tracking number
        tracking_number: { type: GraphQLString },
        tracking_url: { type: GraphQLString },

        // notes
        notes: { type: GraphQLString },

        order_seen: { type: GraphQLBoolean },

        // order products
        order_products: {
            type: new GraphQLList(OrderProductIdentifiersType),
            resolve: async (order: Order, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            order_products
                        WHERE
                            order_id = :order_id AND
                            connected_account_id = :connected_account_id
                    `, {
                        order_id: order.order_id,
                        connected_account_id: order.connected_account_id
                    });



                    for (const row of result.rows)
                        if (row.data && typeof row.data === 'string')
                            row.data = JSON.parse(row.data);


                    return result.rows;

                } catch (error) {
                    return [];
                }

            }
        },




        // shop data
        shop_logo: {
            type: GraphQLString,
            resolve: async (order: Order, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            shop_logo
                        FROM
                            companies
                        WHERE
                            connected_account_id = :connected_account_id;
                    `, {
                        connected_account_id: order.connected_account_id,
                    });

                    if (result.rowsCount === 0)
                        return null;

                    return result.rows[0].shop_logo as string;

                } catch (error) {
                    return [];
                }

            }
        },
        shop_url: {
            type: GraphQLString,
            resolve: async (order: Order, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            shop_url
                        FROM
                            companies
                        WHERE
                            connected_account_id = :connected_account_id;
                    `, {
                        connected_account_id: order.connected_account_id,
                    });

                    if (result.rowsCount === 0)
                        return null;

                    return result.rows[0].shop_url as string;

                } catch (error) {
                    return [];
                }

            }
        },
        shop_name: {
            type: GraphQLString,
            resolve: async (order: Order, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            shop_name
                        FROM
                            companies
                        WHERE
                            connected_account_id = :connected_account_id;
                    `, {
                        connected_account_id: order.connected_account_id,
                    });

                    if (result.rowsCount === 0)
                        return null;

                    return result.rows[0].shop_name as string;

                } catch (error) {
                    return [];
                }

            }
        },
        shop_google_rate_url: {
            type: GraphQLString,
            resolve: async (order: Order, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            shop_google_rate_url
                        FROM
                            companies
                        WHERE
                            connected_account_id = :connected_account_id;
                    `, {
                        connected_account_id: order.connected_account_id,
                    });

                    if (result.rowsCount === 0)
                        return null;

                    return result.rows[0].shop_google_rate_url as string;

                } catch (error) {
                    return [];
                }

            }
        },


        // company data
        company_data: {
            type: CompanyDataType,
            resolve: async (order: Order, args, context, info) => {

                try {

                    const result = await mysql.query(`
                        SELECT
                            *
                        FROM
                            companies
                        WHERE
                            connected_account_id = :connected_account_id
                    `, { connected_account_id: order.connected_account_id });


                    for (const row of result.rows)
                        if (row.data && typeof row.data === 'string')
                            row.data = JSON.parse(row.data);

                    return result.rows[0];

                } catch (error) {
                    return [];
                }

            }
        },

    })
});

export { OrderType };
