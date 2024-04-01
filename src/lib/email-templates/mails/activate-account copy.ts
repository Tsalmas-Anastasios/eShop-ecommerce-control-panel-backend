import { style } from '../config';
import { config } from '../../../config';
import { OrderProductIdentifiers } from '../../../models';

export class ProductStockAlertEmailTemplate {

    html: string;

    constructor(products: OrderProductIdentifiers[]) {


        let products_table_string = '';
        for (const product of products)
            products_table_string += `
                <tr>
                    <td style="width: 80%; text-align: center">
                        ${product.product_details.product_id}
                        <small>${product.product_details.headline}</small>
                    </td>
                    <td style="width: 20%; text-align: center">
                        ${product.product_details.stock}
                    </td>
                </tr>
            `;





        this.html = `

            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Account activation link | Bizyhive</title>
                    <link href="${style.font_family_resource_url}" rel="stylesheet" />

                    <style>

                        body {
                            font-family: "${style.font_family}";
                            background-color: ${style.colors.grey_white.color_grey_background_bold};
                        }

                        .general-frame {
                            background-color: ${style.colors.grey_white.color_white};
                            width: 550px;
                            left: 50%;
                            transform: translateX(-50%);
                            position: relative;
                            margin-top: 100px;
                            border: 5px solid ${style.colors.grey_white.color_white};
                            border-radius: 15px;
                            padding: 25px;
                            box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.15);
                        }

                        .general-frame .title {
                            text-align: center;
                            font-size: 24px;
                            margin-top: 40px;
                            margin-bottom: 60px;
                            font-weight: 600;
                            color: ${style.colors.bold.color_blue_navbar};
                        }

                        .general-frame .text-to-activate {
                            font-size: 20px;
                            color: ${style.colors.grey_white.color_grey_buttons};
                        }

                        .general-frame .text-to-activate .personal-name {
                            margin-bottom: 15px;
                        }

                        .general-frame .text-to-activate .personal-name span {
                            font-weight: bold;
                        }

                        .general-frame .text-to-activate .thank-you {
                            margin-bottom: 25px;
                        }

                        .general-frame .text-to-activate .thank-you .powered-by {
                            font-size: 14px;
                            font-style: italic;
                            color: ${style.colors.grey_white.color_grey_letters_light};
                        }

                        .general-frame .text-to-activate .activate-link {
                            text-align: center;
                        }

                        .general-frame .text-to-activate .activate-link a {
                            color: ${style.colors.bold.color_blue_navbar};
                            font-weight: 600;
                            cursor: pointer;
                        }

                        .general-frame .company-slogan {
                            text-align: center;
                            margin-top: 30px;
                            margin-bottom: 40px;
                            font-size: 13px;
                            font-style: italic;
                            color: ${style.colors.bold.color_blue_navbar};
                        }

                        .general-frame .hr-blue-purple {
                            margin-bottom: 30px;
                            border: 1px solid ${style.colors.bold.color_blue_navbar};
                            border-radius: 50px;
                        }

                        .general-frame .footer {
                            text-align: center;
                            color: ${style.colors.bold.color_blue_black};
                        }

                        .images-area {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-top: 30px;
                        }

                        .images-area img {
                            width: 200px;
                        }

                        .images-area img:first-child {
                        margin-right: 30px;
                    }

                    </style>
                </head>
                <body>
                    <div class="general-frame">
                    <div class="title">
                        Products Stock alert!
                    </div>

                    <div class="text-to-activate">
                        <div class="thank-you">
                            The stock of some of your products is running out. Consult the table
                            below for the evolution of your product stock.
                        </div>

                        <div class="thank-you">
                            <table>
                                <thead>
                                    <tr>
                                        <th style="width: 80%; text-align: center">Product</th>
                                        <th style="width: 20%; text-align: center">Stock</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    ${products_table_string}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="company-slogan">
                        e-Commerce Control Panel made for your needs
                    </div>

                    <hr class="hr-blue-purple" />

                    <div class="footer">
                        Powered by Bizyhive
                    </div>
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
