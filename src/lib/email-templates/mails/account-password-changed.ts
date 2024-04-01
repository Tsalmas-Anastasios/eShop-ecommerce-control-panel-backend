import { style } from '../config';
import { config } from '../../../config';

export class AccountPasswordChangedEmail {

    html: string;

    constructor(first_name: string, last_name: string, date_time: string | Date) {

        this.html = `

            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Password changed! | Bizyhive</title>
                    <link href="${style.font_family_resource_url}" rel="stylesheet" />

                    <style>

                        body {
                            font-family: "${style.font_family}"; /*change it with config variable*/
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
                            margin-bottom: 15px;
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

                        .general-frame a.reset-password-btn {
                            background-color: ${style.colors.bold.color_blue_navbar};
                            color: ${style.colors.grey_white.color_white};
                            display: block;
                            width: 100%;
                            margin-top: 40px;
                            text-align: center;
                            border: 3px solid ${style.colors.bold.color_blue_navbar};
                            border-radius: 15px;
                            font-size: 22px;
                            padding-top: 20px;
                            padding-bottom: 20px;
                            cursor: pointer;
                            text-decoration: none;
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
                            margin-bottom: 50px;
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
                            Password changed!
                        </div>

                        <div class="text-to-activate">
                            <div class="personal-name">
                                Dear <span>${first_name} ${last_name} </span>,
                            </div>
                            <div class="thank-you">
                                On ${date_time} you updated your password. Your new password has
                                successfully been saved to our system and now you can use it to log in
                                to your account.
                            </div>
                            <div class="thank-you2">
                                Thank you for helping us keep your account secure!
                            </div>
                            <div class="activate-link" style="margin-top: 25px;">
                                The Bizyhive's team.
                            </div>
                        </div>

                        <a href="${config.bizyhive_google_rate_url}" class="reset-password-btn">
                            Rate us
                        </a>

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
