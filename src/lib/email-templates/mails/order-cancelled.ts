import { style } from '../config';
import { config } from '../../../config';
import { OrderCancelledMailData } from '../../../models';



export class OrderCancelledMail {

    html: string;

    constructor(data: OrderCancelledMailData) {

        this.html = `

            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Order confirmation | Bizyhive</title>
                    <script src="https://kit.fontawesome.com/252e2148d4.js" crossorigin="anonymous"></script>
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
                            Order just cancelled 😔<br />
                            Shop cancel the order...
                        </div>
                        <div class="text">
                            Dear <span class="bold">${data.first_name} ${data.last_name}</span>,
                            <p>
                                on ${data.date_time}, shop cancel your order because of conflicts or
                                products that are out of stock. We are sorry for this and we
                                appriciate for the future.
                            </p>
                            <p>
                                Order with number ${data.order_number} closed by shop, for shop's
                                reasons. We are sorry for this and we looking to future to make you
                                happy again!
                                <!-- Because we want and need you in our company, we give you a
                                coupon with code {{ coupon_code }} and amount {{ coupon_amount }} that
                                expires on {{ expire_date }}. -->
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

                        <div class="footer">Powered by <a href="${config.web_app_home_url}">Bizyhive</a></div>
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
