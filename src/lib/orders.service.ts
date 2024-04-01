import { Request } from 'express';
import {
    OrderProductDetails, GraphQLSearchOrdersParamsArgs, OrderTypeSearch, SpecificListOrdersParams,
    NewUpdateOrder, OrderProductIdentifiers, OrderConfirmationMailUsedDataCompanyBasicData, OrderTransaction
} from '../models';
import { utils } from '../lib/utils.service';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';
import { orderIDNumbersGenerator } from './id_numbers_generators/orders';



class OrdersList {

    async getProductDetails(product_id: string): Promise<OrderProductDetails> {

        try {

            const result = await mysql.query(`
                SELECT
                    product_id,
                    headline,
                    product_brand,
                    categories_belongs,
                    product_code,
                    product_model,
                    images,
                    notes
                FROM
                    products
                WHERE
                    product_id = :product_id
            `, {
                product_id: product_id,
            });

            const product = new OrderProductDetails(result.rows[0]);

            return Promise.resolve(product);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async getOrders(params: GraphQLSearchOrdersParamsArgs, req?: Request): Promise<OrderTypeSearch[]> {

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
                        orders${graphQueryParams !== '()' ? graphQueryParams : ''}{
                            order_id
                            proof
                            email
                            first_name
                            last_name
                            address
                            postal_code
                            city
                            country
                            phone
                            cell_phone
                            confirm_date
                            sent_date
                            completed_date
                            archived_date
                            returned_date
                            confirmed
                            sent
                            completed

                            transfer_courier
                            transfer_courier_details{
                                name

                                type
                                type_details{
                                    type_description
                                }

                                description
                                banner_url
                                main_url
                                tracking_basic_url
                                integrated
                            }

                            current_status
                            invoice_data__first_name
                            invoice_data__last_name
                            invoice_data__company
                            invoice_data__tax_number
                            invoice_data__doy
                            invoice_data__address
                            invoice_data__postal_code
                            invoice_data__city
                            invoice_data__country
                            invoice_data__phone
                            invoice_data__cell_phone
                            invoice_data__is_valid
                            payment_type

                            payment_type_details{
                                label
                                description
                                service
                                active
                                archived
                            }

                            connected_account_id
                            order_number
                            invoice_data__invoice_number
                            archived
                            clear_value
                            transportation
                            cash_on_delivery_payment
                            cash_on_delivery
                            extra_fees
                            extra_fees_costs
                            fees
                            fee_percent
                            order_total
                            tracking_number
                            tracking_url

                            notes

                            order_seen

                            order_products{
                                rec_id
                                product_id
                                active
                                archived
                                quantity
                                supplied_customer_price
                                discount
                                discount_percent
                                fees
                                fee_percent

                                product_details{
                                    headline
                                    product_brand
                                    categories_belongs
                                    product_code
                                    product_model
                                    stock
                                    supplied_price
                                    clear_price
                                    fee_percent
                                    fees
                                    discount_percent
                                    discount

                                    specification{
                                        id
                                        category_name

                                        fields{
                                            id
                                            specification_field_name
                                            specification_field_value
                                        }
                                    }

                                    product_description
                                    supplier
                                    current_status
                                    archived
                                    notes
                                    created_at
                                    current_version
                                    product_shared

                                    images {
                                        id
                                        url
                                        main_image
                                        product_id
                                        archived
                                        created_at
                                    }


                                    product_stock{
                                        rec_id
                                        product_id
                                        connected_account_id
                                        warehouse_id
                                        runway_id
                                        column_id
                                        column_shelf_id
                                        stock_quantity
                                    }

                                    notes

                                }

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

                        }
                    }
                `,
                contextValue: req || null,
            });

            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });

            const orders = result.data.orders as OrderTypeSearch[];

            return Promise.resolve(orders);


        } catch (error) {
            return Promise.reject(error);
        }

    }

}




class SpecificOrdersList {

    async getOrders(params: SpecificListOrdersParams, account_id: string, req: Request): Promise<OrderTypeSearch[]> {

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
                        orders${graphQueryParams !== '()' ? graphQueryParams : ''}{
                            order_id
                            proof
                            email
                            first_name
                            last_name
                            address
                            postal_code
                            city
                            country
                            phone
                            cell_phone
                            confirm_date
                            sent_date
                            completed_date
                            archived_date
                            returned_date
                            confirmed
                            sent
                            completed

                            transfer_courier
                            transfer_courier_details{
                                name

                                type
                                type_details{
                                    type_description
                                }

                                description
                                banner_url
                                main_url
                                tracking_basic_url
                                integrated
                            }

                            current_status
                            invoice_data__first_name
                            invoice_data__last_name
                            invoice_data__company
                            invoice_data__tax_number
                            invoice_data__doy
                            invoice_data__address
                            invoice_data__postal_code
                            invoice_data__city
                            invoice_data__country
                            invoice_data__phone
                            invoice_data__cell_phone
                            invoice_data__is_valid
                            payment_type

                            payment_type_details{
                                label
                                description
                                service
                                active
                                archived
                            }

                            connected_account_id
                            order_number
                            invoice_data__invoice_number
                            archived
                            clear_value
                            transportation
                            cash_on_delivery_payment
                            cash_on_delivery
                            extra_fees
                            extra_fees_costs
                            fees
                            fee_percent
                            order_total
                            tracking_number
                            tracking_url

                            notes

                            order_seen

                            order_products{
                                rec_id
                                product_id
                                active
                                archived
                                quantity
                                supplied_customer_price
                                discount
                                discount_percent
                                fees
                                fee_percent

                                product_details{
                                    headline
                                    product_brand
                                    categories_belongs
                                    product_code
                                    product_model
                                    stock
                                    supplied_price
                                    clear_price
                                    fee_percent
                                    fees
                                    discount_percent
                                    discount

                                    specification{
                                        id
                                        category_name

                                        fields{
                                            id
                                            specification_field_name
                                            specification_field_value
                                        }
                                    }

                                    product_description
                                    supplier
                                    current_status
                                    archived
                                    notes
                                    created_at
                                    current_version
                                    product_shared

                                    images {
                                        id
                                        url
                                        main_image
                                        product_id
                                        archived
                                        created_at
                                    }

                                    product_stock{
                                        rec_id
                                        product_id
                                        connected_account_id
                                        warehouse_id
                                        runway_id
                                        column_id
                                        column_shelf_id
                                        stock_quantity
                                    }

                                    notes

                                }

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

                        }
                    }
                `,
                contextValue: req || null,
            });

            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });

            const orders = result.data.orders as OrderTypeSearch[];

            return Promise.resolve(orders);


        } catch (error) {
            return Promise.reject(error);
        }

    }


}



class SpecificOrder {

    async getOrder(order_id: string, account_id: string, req: Request): Promise<OrderTypeSearch> {

        try {

            const orders: OrderTypeSearch[] = await ordersList.getOrders({ order_id: order_id, connected_account_id: account_id }, req);
            if (orders.length === 0)
                return Promise.resolve(null);

            return Promise.resolve(orders[0] as OrderTypeSearch);

        } catch (error) {
            return Promise.reject(error);
        }

    }

}



class UpdateOrder {

    async updateOrder(order: NewUpdateOrder, account_id: string): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    orders
                SET
                    ${order?.proof && order?.proof !== null ? `proof = '${order.proof}',` : ``}
                    ${order?.email && order?.email !== null ? `email = '${order.email}',` : ``}
                    ${order?.first_name && order?.first_name !== null ? `first_name = '${order.first_name}',` : ``}
                    ${order?.last_name && order?.last_name !== null ? `last_name = '${order.last_name}',` : ``}
                    ${order?.address && order?.address !== null ? `address = '${order.address}',` : ``}
                    ${order?.postal_code && order?.postal_code !== null ? `postal_code = '${order.postal_code}',` : ``}
                    ${order?.city && order?.city !== null ? `city = '${order.city}',` : ``}
                    ${order?.country && order?.country !== null ? `country = '${order.country}',` : ``}
                    ${order?.phone && order?.phone !== null ? `phone = '${order.phone}',` : ``}
                    ${order?.cell_phone && order?.cell_phone !== null ? `cell_phone = '${order.cell_phone}',` : ``}
                    ${order?.transfer_courier && order?.transfer_courier !== null ? `transfer_courier = '${order.transfer_courier}',` : ``}
                    ${order?.invoice_data__first_name && order?.invoice_data__first_name !== null ? `invoice_data__first_name = '${order.invoice_data__first_name}',` : ``}
                    ${order?.invoice_data__last_name && order?.invoice_data__last_name !== null ? `invoice_data__last_name = '${order.invoice_data__last_name}',` : ``}
                    ${order?.invoice_data__company && order?.invoice_data__company !== null ? `invoice_data__company = '${order.invoice_data__company}',` : ``}
                    ${order?.invoice_data__tax_number && order?.invoice_data__tax_number !== null ? `invoice_data__tax_number = '${order.invoice_data__tax_number}',` : ``}
                    ${order?.invoice_data__doy && order?.invoice_data__doy !== null ? `invoice_data__doy = '${order.invoice_data__doy}',` : ``}
                    ${order?.invoice_data__address && order?.invoice_data__address !== null ? `invoice_data__address = '${order.invoice_data__address}',` : ``}
                    ${order?.invoice_data__postal_code && order?.invoice_data__postal_code !== null ? `invoice_data__postal_code = '${order.invoice_data__postal_code}',` : ``}
                    ${order?.invoice_data__city && order?.invoice_data__city !== null ? `invoice_data__city = '${order.invoice_data__city}',` : ``}
                    ${order?.invoice_data__country && order?.invoice_data__country !== null ? `invoice_data__country = '${order.invoice_data__country}',` : ``}
                    ${order?.invoice_data__phone && order?.invoice_data__phone !== null ? `invoice_data__phone = '${order.invoice_data__phone}',` : ``}
                    ${order?.invoice_data__cell_phone && order?.invoice_data__cell_phone !== null ? `invoice_data__cell_phone = '${order.invoice_data__cell_phone}',` : ``}
                    ${order?.invoice_data__is_valid && order?.invoice_data__is_valid !== null ? `invoice_data__is_valid = '${order.invoice_data__is_valid}',` : ``}
                    ${order?.payment_type && order?.payment_type !== null ? `payment_type = '${order.payment_type}',` : ``}
                    ${order?.clear_value && order?.clear_value !== null ? `clear_value = ${order.clear_value},` : ``}
                    ${order?.transportation && order?.transportation !== null ? `transportation = ${order.transportation},` : ``}
                    ${order?.cash_on_delivery_payment && order?.cash_on_delivery_payment !== null ? `cash_on_delivery_payment = ${order.cash_on_delivery_payment ? 1 : 0},` : ``}
                    ${order?.cash_on_delivery_payment && order?.cash_on_delivery_payment !== null ? order.cash_on_delivery_payment ? `cash_on_delivery = ${order.cash_on_delivery},` : `` : ``}
                    ${order?.extra_fees && order?.extra_fees !== null ? `extra_fees = ${order.extra_fees ? 1 : 0},` : ``}
                    ${order?.extra_fees && order?.extra_fees !== null ? order.extra_fees ? `extra_fees_costs = ${order.extra_fees_costs},` : `` : ``}
                    ${order?.fees && order?.fees !== null ? `fees = ${order.fees},` : ``}
                    ${order?.fee_percent && order?.fee_percent !== null ? `fee_percent = ${order.fee_percent},` : ``}
                    ${order?.order_total && order?.order_total !== null ? `order_total = ${order.order_total},` : ``}
                    ${order?.tracking_number && order?.tracking_number !== null ? `tracking_number = '${order.tracking_number}',` : ``}
                    ${order?.tracking_url && order?.tracking_url !== null ? `tracking_url = '${order.tracking_url}',` : ``}
                    order_id = :order_id
                WHERE
                    order_id = :order_id AND
                    connected_account_id = :connected_account_id
            `, {
                order_id: order.order_id,
                connected_account_id: account_id,
            });

            await this.updateOrderProducts(order.order_products, account_id, order.order_id);

        } catch (error) {
            return Promise.reject(error);
        }

    }



    async updateOrderProducts(order_products: OrderProductIdentifiers[], account_id: string, order_id: string): Promise<void> {

        try {

            let result: QueryResult;
            for (let i = 0; i < order_products.length; i++)
                if (order_products[i].status === 'new')
                    result = await mysql.query(`
                        INSERT INTO
                            order_products
                        SET
                            rec_id = :rec_id,
                            product_id = :product_id,
                            order_id = :order_id,
                            connected_account_id = :connected_account_id,
                            quantity = :quantity,
                            supplied_customer_price = :supplied_customer_price,
                            ${order_products[i]?.discount && order_products[i]?.discount !== null ? `discount = ${order_products[i].discount},` : ``}
                            ${order_products[i]?.discount_percent && order_products[i]?.discount_percent !== null ? `discount_percent = ${order_products[i].discount_percent},` : ``}
                            ${order_products[i]?.fees && order_products[i]?.fees !== null ? `fees = ${order_products[i].fees},` : ``}
                            ${order_products[i]?.fee_percent && order_products[i]?.fee_percent !== null ? `fee_percent = ${order_products[i].fee_percent}` : ``}
                    `, {
                        rec_id: orderIDNumbersGenerator.getNewOrderProductId(),
                        product_id: order_products[i].product_id,
                        order_id: order_id,
                        connected_account_id: account_id,
                        quantity: order_products[i].quantity,
                        supplied_customer_price: order_products[i].supplied_customer_price,
                    });
                else if (order_products[i].status === 'updated')
                    result = await mysql.query(`
                        UPDATE
                            order_products
                        SET
                            ${order_products[i]?.quantity && order_products[i]?.quantity !== null ? `quantity = ${order_products[i].quantity},` : ``}
                            ${order_products[i]?.supplied_customer_price && order_products[i]?.supplied_customer_price !== null ? `supplied_customer_price = ${order_products[i].supplied_customer_price},` : ``}
                            ${order_products[i]?.discount && order_products[i]?.discount !== null ? `discount = ${order_products[i].discount},` : ``}
                            ${order_products[i]?.discount_percent && order_products[i]?.discount_percent !== null ? `discount_percent = ${order_products[i].discount_percent},` : ``}
                            ${order_products[i]?.fees && order_products[i]?.fees !== null ? `fees = ${order_products[i].fees},` : ``}
                            ${order_products[i]?.fee_percent && order_products[i]?.fee_percent !== null ? `fee_percent = ${order_products[i].fee_percent}` : ``}
                        WHERE
                            rec_id = :rec_id AND
                            order_id = :order_id AND
                            connected_account_id = :account_id
                    `, {
                        rec_id: order_products[i].rec_id,
                        order_id: order_id,
                        connected_account_id: account_id,
                    });
                else if (order_products[i].status === 'deleted')
                    result = await mysql.query(`
                        DELETE FROM
                            order_products
                        WHERE
                            rec_id = :rec_id AND
                            order_id = :order_id AND
                            connected_account_id = :connected_account_id
                    `, {
                        rec_id: order_products[i].rec_id,
                        order_id: order_id,
                        connected_account_id: account_id,
                    });

        } catch (error) {
            return Promise.reject(error);
        }

    }

}




class AddNewOrder {

    async addOrder(order: NewUpdateOrder, account_id: string): Promise<{
        identifiers: { order_id: string, order_number: string, invoice_data__invoice_number: string },
        stock_alert_products: OrderProductIdentifiers[],
    }> {

        try {

            // TODO: generate tracking number & url




            const status_acting: {
                confirmed: boolean;
                sent: boolean;
                completed: boolean;
                returned: boolean;
                archived: boolean;
            } = {
                confirmed: true,
                sent: false,
                completed: false,
                returned: false,
                archived: false
            };

            if (order?.current_status)
                for (const status in status_acting) {
                    status_acting[status] = true;
                    if (status === order?.current_status)
                        break;
                }


            const identifiers = {
                order_id: orderIDNumbersGenerator.getNewOrderId(),
                order_number: orderIDNumbersGenerator.getNewOrderNumberForUser(),
                invoice_data__invoice_number: orderIDNumbersGenerator.getNewInvoiceID(),
            };
            const result = await mysql.query(`
                INSERT INTO
                    orders
                SET
                    order_id = :order_id,
                    proof = :proof,
                    email = :email,
                    first_name = :first_name,
                    last_name = :last_name,
                    address = :address,
                    postal_code = :postal_code,
                    city = :city,
                    country = :country,
                    phone = :phone,
                    ${order?.cell_phone && order?.cell_phone !== null ? `cell_phone = '${order.cell_phone}',` : ``}
                    ${status_acting?.confirmed ? `confirm_date = '${new Date()}',` : ``}
                    ${status_acting?.sent ? `sent_date = '${new Date()}',` : ``}
                    ${status_acting?.completed ? `completed_date = '${new Date()}',` : ``}
                    ${status_acting?.archived ? `archived_date = '${new Date()}',` : ``}
                    ${status_acting?.returned ? `returned_date = '${new Date()}',` : ``}
                    confirmed = :confirmed,
                    sent = :sent,
                    completed = :completed,
                    returned = :returned,
                    archived = :archived,
                    transfer_courier = :transfer_courier,
                    ${order?.invoice_data__first_name && order?.invoice_data__first_name !== null ? `invoice_data__first_name = '${order.invoice_data__first_name}',` : ``}
                    ${order?.invoice_data__last_name && order?.invoice_data__last_name !== null ? `invoice_data__last_name = '${order.invoice_data__last_name}',` : ``}
                    ${order?.invoice_data__company && order?.invoice_data__company !== null ? `invoice_data__company = '${order.invoice_data__company}',` : ``}
                    ${order?.invoice_data__tax_number && order?.invoice_data__tax_number !== null ? `invoice_data__tax_number = '${order.invoice_data__tax_number}',` : ``}
                    ${order?.invoice_data__doy && order?.invoice_data__doy !== null ? `invoice_data__doy = '${order.invoice_data__doy}',` : ``}
                    ${order?.invoice_data__address && order?.invoice_data__address !== null ? `invoice_data__address = '${order.invoice_data__address}',` : ``}
                    ${order?.invoice_data__postal_code && order?.invoice_data__postal_code !== null ? `invoice_data__postal_code = '${order.invoice_data__postal_code}',` : ``}
                    ${order?.invoice_data__city && order?.invoice_data__city !== null ? `invoice_data__city = '${order.invoice_data__city}',` : ``}
                    ${order?.invoice_data__country && order?.invoice_data__country !== null ? `invoice_data__country = '${order.invoice_data__country}',` : ``}
                    ${order?.invoice_data__phone && order?.invoice_data__phone !== null ? `invoice_data__phone = '${order.invoice_data__phone}',` : ``}
                    ${order?.invoice_data__cell_phone && order?.invoice_data__cell_phone !== null ? `invoice_data__cell_phone = '${order.invoice_data__cell_phone}',` : ``}
                    ${order?.invoice_data__is_valid && order?.invoice_data__is_valid !== null ? `invoice_data__is_valid = '${order.invoice_data__is_valid}',` : ``}
                    payment_type = :payment_type,
                    connected_account_id = :connected_account_id,
                    order_number = :order_number,
                    invoice_data__invoice_number = :invoice_data__invoice_number,
                    clear_value = :clear_value,
                    transportation = :transportation,
                    cash_on_delivery_payment = :cash_on_delivery_payment,
                    cash_on_delivery = :cash_on_delivery,
                    extra_fees = :extra_fees,
                    extra_fees_costs = :extra_fees_costs,
                    fees = :fees,
                    fee_percent = :fee_percent,
                    order_total = :order_total,
                    tracking_number = :tracking_number,
                    tracking_url = :tracking_url
            `, {
                order_id: identifiers.order_id,
                proof: order.proof,
                email: order.email,
                first_name: order.first_name,
                last_name: order.last_name,
                address: order.address,
                postal_code: order.postal_code,
                city: order.city,
                country: order.country,
                phone: order.phone,
                confirmed: status_acting.confirmed,
                sent: status_acting.sent,
                completed: status_acting.completed,
                returned: status_acting.returned,
                archived: status_acting.archived,
                transfer_courier: order.transfer_courier,
                payment_type: order.payment_type,
                connected_account_id: account_id,
                order_number: identifiers.order_number,
                invoice_data__invoice_number: identifiers.invoice_data__invoice_number,
                clear_value: order.clear_value,
                transportation: order.transportation,
                cash_on_delivery_payment: order?.cash_on_delivery_payment ? 1 : 0,
                cash_on_delivery: order?.cash_on_delivery_payment ? order.cash_on_delivery : 0,
                extra_fees: order?.extra_fees ? 1 : 0,
                extra_fees_costs: order.extra_fees ? order.extra_fees_costs : 0,
                fees: order.fees,
                fee_percent: order.fee_percent,
                order_total: order.order_total,
                tracking_number: '123456789CBA',                             // TODO: actual tracking number
                tracking_url: 'https://adorithm.com'                         // TODO: actual tracking url
            });



            const stock_alert_products: OrderProductIdentifiers[] = await this.addOrderProducts(order.order_products, account_id, identifiers.order_id);


            return Promise.resolve({
                identifiers: identifiers,
                stock_alert_products: stock_alert_products,
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }


    async addOrderProducts(products: OrderProductIdentifiers[], account_id: string, order_id: string): Promise<OrderProductIdentifiers[]> {

        try {

            const stock_alert_products: OrderProductIdentifiers[] = [];
            let query_string = '';
            for (const product of products)
                if (product.product_details.stock >= product.quantity) {
                    query_string += `
                        INSERT INTO
                            order_products
                        SET
                            product_id = '${product.product_id}',
                            order_id = '${order_id}',
                            connected_account_id = '${account_id}',
                            quantity = '${product.quantity}',
                            supplied_customer_price = '${product.supplied_customer_price}',
                            ${product?.discount && product?.discount !== null ? `discount = ${product.discount},` : ``}
                            ${product?.discount_percent && product?.discount_percent !== null ? `discount_percent = ${product.discount_percent},` : ``}
                            ${product?.fees && product?.fees !== null ? `fees = ${product.fees},` : ``}
                            ${product?.fee_percent && product?.fee_percent !== null ? `fee_percent = ${product.fee_percent},` : ``}
                            rec_id = '${orderIDNumbersGenerator.getNewOrderProductId()}';



                        UPDATE
                            products
                        SET
                            stock = ${product.product_details.stock - product.quantity}
                        WHERE
                            product_id = '${product.product_id}' AND
                            connected_account_id = '${account_id}';
                    `;



                    let total_sold_stock = 0;
                    for (const warehouse_stock of product.product_details.product_stock)
                        if (warehouse_stock.stock_quantity >= (product.quantity - total_sold_stock)) {
                            query_string += `
                                UPDATE
                                    products_stock_warehouses
                                SET
                                    stock_quantity = ${warehouse_stock.stock_quantity - (product.quantity + total_sold_stock)}
                                WHERE
                                    rec_id = '${warehouse_stock.rec_id}' AND
                                    product_id = '${product.product_details.product_id}' AND
                                    connected_account_id = '${account_id}'
                            `;

                            break;
                        } else {
                            query_string += `
                                UPDATE
                                    products_stock_warehouses
                                SET
                                    stock_quantity = 0
                                WHERE
                                    rec_id = '${warehouse_stock.rec_id}' AND
                                    product_id = '${product.product_details.product_id}' AND
                                    connected_account_id = '${account_id}';
                            `;

                            total_sold_stock += warehouse_stock.stock_quantity;
                        }



                    if (product.product_details.stock - product.quantity <= 5)
                        stock_alert_products.push(product);

                }


            const result = await mysql.query(query_string);



            return Promise.resolve(stock_alert_products);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}



class CheckOrder {

    async orderExists(order_id: string, account_id: string): Promise<boolean> {

        try {

            const result = await mysql.query(`
                SELECT
                    order_number
                FROM
                    orders
                WHERE
                    order_id = :order_id AND
                    connected_account_id = :connected_account_id;
            `, {
                order_id: order_id,
                connected_account_id: account_id,
            });


            if (result.rowsCount === 0)
                return Promise.resolve(false);

            return Promise.resolve(true);

        } catch (error) {
            return Promise.reject(error);
        }

    }

}



class ShopData {

    async getCompanyDataForConfirmEmail(connected_account_id: string, req?: Request): Promise<OrderConfirmationMailUsedDataCompanyBasicData> {

        try {

            const result = await graphql({
                schema: schema,
                source: `
                    {
                        orderSentEmail(connected_account_id: "${connected_account_id}") {
                            shop_logo
                            shop_url
                            shop_name
                            shop_google_rate_url
                        }
                    }
                `,
                contextValue: req || null,
            });


            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });

            const companies = result.data.orders as OrderConfirmationMailUsedDataCompanyBasicData[];

            return Promise.resolve(companies[0] as OrderConfirmationMailUsedDataCompanyBasicData);

        } catch (error) {
            return Promise.reject(error);
        }

    }

}




class OrderTransactionsHistoryHandlerService {


    async addTransaction(data: OrderTransaction): Promise<void> {

        try {


            const result = await mysql.query(`
                INSERT INTO
                    orders_transactions
                SET
                    ${data?.order_created_at ? `order_created_at = '${data.order_created_at}',` : ``}
                    ${data?.whole_order_updated ? `whole_order_updated = 1,` : ``}
                    ${data?.status_updated ? `status_updated = 1,` : ``}
                    ${data?.status_before ? `status_before = '${data.status_before}',` : ``}
                    ${data?.status_after ? `status_after = '${data.status_after}',` : ``}
                    ${data?.field_changed ? `field_changed = '${data.field_changed}',` : ``}
                    ${data?.value_before ? `value_before = '${data.value_before}',` : ``}
                    ${data?.value_after ? `value_after = '${data.value_after}',` : ``}
                    order_id = :order_id,
                    connected_account_id = :connected_account_id,
                    updated_by = :updated_by
            `, data);


        } catch (error) {
            return Promise.resolve(error);
        }

    }


}



const ordersList = new OrdersList();
const specificOrdersList = new SpecificOrdersList();
const specificOrder = new SpecificOrder();
const updateOrder = new UpdateOrder();
const addNewOrder = new AddNewOrder();
const checkOrder = new CheckOrder();
const shopData = new ShopData();
const orderTransactionsHistoryHandlerService = new OrderTransactionsHistoryHandlerService();
export {
    ordersList, specificOrdersList, specificOrder, updateOrder, addNewOrder, checkOrder, shopData,
    orderTransactionsHistoryHandlerService
};
