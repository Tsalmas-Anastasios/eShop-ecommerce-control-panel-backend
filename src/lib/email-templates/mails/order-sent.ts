import { style } from '../config';
import { config } from '../../../config';
import { OrderSentMailData } from '../../../models';
import { orderProductsListEmailOrderSent } from '../services/order-sent.service';


export class OrderSentMail {

    html: string;

    // async products(data: { order_id: string, connected_account_id: string }): Promise<string> {

    //     try {

    //         return Promise.resolve(await orderProductsList.createProductCards({ order_id: data.order_id, connected_account_id: data.connected_account_id }));

    //     } catch (error) {
    //         return Promise.reject(error);
    //     }

    // }

    constructor(data: OrderSentMailData) {

        this.html = `

            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Order sent!!! | Bizyhive</title>
                    <script src="https://kit.fontawesome.com/252e2148d4.js" crossorigin="anonymous" ></script>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
                    <link href="${style.font_family_resource_url}" rel="stylesheet" />

                    <style>

                        body {
                            font-family: "${style.font_family}";
                            background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));
                            margin-top: 60px;
                        }

                        .bold {
                            font-weight: bold;
                        }

                        .shop-credentials {
                        }
                        .shop-credentials .logo {
                            text-align: center;
                            margin-bottom: 30px;
                        }
                        .shop-credentials .logo img {
                            width: 200px;
                        }

                        /* frame */
                        .frame {
                            max-width: 550px;
                            border: 1px solid ${style.colors.grey_white.color_grey__to_black_light};
                            display: block;
                            margin-left: auto;
                            margin-right: auto;
                            padding: 25px;
                            border-radius: 15px;
                        }

                        .frame .title {
                            text-align: center;
                            font-size: 24px;
                            margin-top: 40px;
                            margin-bottom: 60px;
                            font-weight: 600;
                            color: ${style.colors.bold.color_blue_navbar};
                        }

                        .frame .text {
                            font-size: 16px;
                        }

                        .frame .text p.order-number {
                            text-align: center;
                        }

                        .frame .text p.order-number a {
                            color: ${style.colors.bold.color_blue_navbar};
                            font-weight: bold;
                        }

                        .frame .text span.partners {
                            font-style: italic;
                            font-size: 12px;
                        }

                        .frame .text p.secured-by {
                            text-align: center;
                            font-size: 20px;
                            color: ${style.colors.grey_white.color_grey_middle};
                        }

                        .frame .text p.secured-by a {
                            color: ${style.colors.grey_white.color_grey_middle};
                        }

                        .frame .rate {
                            text-align: center;
                            display: flex;
                            justify-content: space-around;
                            margin-top: 35px;
                            margin-bottom: 40px;
                        }

                        .frame .rate a {
                            text-decoration: none;
                            font-size: 20px;
                            width: calc(50% - 10px);
                            padding-top: 25px;
                            padding-bottom: 25px;
                            border-radius: 15px;
                        }

                        .frame .rate a:first-child {
                            color: ${style.colors.bold.color_blue_navbar};
                        }

                        .frame .rate a:last-child {
                            background-color: ${style.colors.bold.color_blue_navbar};
                            border: 1px solid ${style.colors.bold.color_blue_navbar};
                            color: ${style.colors.grey_white.color_grey_middle};
                        }

                        .frame .footer {
                            text-align: center;
                        }

                        .frame .footer a {
                            color: ${style.colors.bold.color_blue_navbar};
                        }

                        .images-area {
                            display: flex;
                            text-align: center;
                            justify-content: center;
                            margin-top: 30px;
                            margin-bottom: 70px;
                            align-items: center;
                        }
                        .images-area img {
                            width: 150px;
                        }
                        .images-area img:first-child {
                            margin-right: 20px;
                        }

                        .order-details {
                            border-top: 1px solid ${style.colors.grey_white.color_grey__to_black_light};
                            margin-top: 45px;
                            padding-top: 20px;
                            margin-bottom: 35px;
                        }

                        .order-details .order-details-title {
                            text-align: center;
                            font-weight: bold;
                            font-size: 20px;
                        }

                        .order-details .info {
                        }
                        .order-details .info .address-info {
                            display: flex;
                            margin-top: 15px;
                        }

                        .order-details .info .address-info .billing-info,
                        .order-details .info .address-info .delivery-details {
                            width: calc(50% - 10px);
                        }
                        .order-details .info .address-info .delivery-details {
                            margin-left: 20px;
                        }

                        .order-details .info .address-info .address-title {
                            text-align: center;
                            font-size: 18px;
                            text-decoration: underline;
                        }

                        .order-details .info .address-info .info-column {
                            font-size: 14px;
                        }

                        .order-details .info .address-info .info-column:first-child {
                            margin-top: 12px;
                        }

                        .order-details .info .address-info .info-column:not(:first-child) {
                            border-top: 1px solid ${style.colors.grey_white.color_grey__to_black_light};
                            padding-top: 8px;
                        }

                        .order-details .info .address-info .info-column:not(:last-child) {
                            padding-bottom: 8px;
                        }

                        .order-details .info .order-products {
                            margin-top: 20px;
                            margin-bottom: 20px;
                        }

                        .order-details .info .order-products .product-card {
                            background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3));
                            padding: 20px;
                            padding-bottom: 16px;
                            display: flex;
                            border-radius: 15px;
                        }

                        .order-details .info .order-products .product-card .img {
                            width: 150px;
                        }
                        .order-details .info .order-products .product-card .img img {
                            width: 100%;
                            object-fit: cover;
                            border-radius: 15px 0 0 15px;
                        }

                        .order-details .info .order-products .product-card .details {
                            margin-left: 15px;
                        }

                        .order-details .info .order-products .product-card .details .headline {
                            font-weight: bold;
                            margin-bottom: 5px;
                            word-wrap: break-word;
                            overflow-wrap: break-word;
                        }

                        .order-details .info .order-products .product-card .details .product-code {
                            font-size: 14px;
                            color: ${style.colors.grey_white.color_grey_middle};
                            margin-bottom: 5px;
                        }

                        .order-details .info .order-products .product-card .details .price-stock {
                            display: flex;
                            margin-top: 15px;
                        }

                        .order-details .info .order-products .product-card .details .price-stock .price,
                        .order-details .info .order-products .product-card .details .price-stock .stock {
                            width: 100%;
                        }

                        .order-details .info .order-products .product-card .details .price-stock .stock {
                            text-align: center;
                        }

                        .order-details .info .order-products .product-card .details .price-stock .stock span {
                            font-size: 14px;
                            color: ${style.colors.grey_white.color_grey__to_black_light};
                        }

                        .order-details .info .order-products .product-card .details .price-stock .price {
                            text-align: right;
                        }
                    </style>
                </head>
                <body>
                    <div class="shop-credentials">
                        <div class="logo">
                            <a href="${data.shop_url}">
                                <img src="${data.shop_logo}" alt="${data.shop_name}" />
                            </a>
                        </div>
                    </div>

                    <div class="frame">
                        <div class="title">
                            Order sent!!! 📦 ✈️
                        </div>
                        <div class="text">
                            Dear <span class="bold">${data.first_name} ${data.last_name}</span>,
                            <p>
                                your order has been given to our partner transport company. Your agony
                                is coming to an end as in a few hours you will receive your order! We
                                can't wait to make you happy!🥳 😁
                            </p>
                            <p class="order-number">See your order trip <a href="${data.tracking_url}">here (${data.tracking_url})</a></p>

                            <div class="order-details">
                                <div class="order-details-title">Your order details</div>
                                <div class="info">
                                    <div class="address-info">
                                        <div class="billing-info">
                                            <div class="address-title">Billing information</div>
                                            <div class="info-details">
                                                <div class="info-column">
                                                    ${data.invoice_data__address}, ${data.invoice_data__city}, ${data.invoice_data__postal_code}, ${data.invoice_data__country}
                                                </div>
                                                <div class="info-column">${data.invoice_data__phone}</div>
                                                <div class="info-column">
                                                    ${data.invoice_data__first_name} ${data.invoice_data__last_name}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="delivery-details">
                                            <div class="address-title">Delivery details</div>
                                                <div class="info-details">
                                                    <div class="info-column">
                                                        ${data.address}, ${data.city}, ${data.postal_code}, ${data.country}
                                                    </div>
                                                    <div class="info-column">${data.phone}</div>
                                                    <div class="info-column">
                                                        ${data.first_name} ${data.last_name}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="order-products">
                                        <!-- PRODUCTS -->
                                        ${data.products}
                                    </div>
                                </div>
                            </div>

                            <p>
                                Thank you for trusting us, <span class="bold">${data.shop_name}</span>,
                                <span class="partners">
                                    parnters of Bizyhive platform.
                                </span>
                            </p>
                            <p class="secured-by">
                                <i class="fas fa-lock"></i>
                                Secured by <a href="${config.web_app_home_url}">Bizyhive</a>
                            </p>
                        </div>

                        <div class="rate">
                            <a href="${data.shop_google_rate_url}">Rate our shop</a>
                            <a href="${config.bizyhive_google_rate_url}">Rate Bizyhive</a>
                        </div>

                        <div class="footer">Powered by <a href="">Bizyhive</a></div>
                    </div>

                    <div class="images-area">
                        <a href="${config.mother_company_url}">
                            <img src="${style.logo.adorithm}" alt="adorithm-logo" />
                        </a>
                        <a href="${config.web_app_home_url}">
                            <img src="${style.logo.control_panel}" alt="control-panel-logo" />
                        </a>
                    </div>
                </body>
            </html>

        `;

    }

}
