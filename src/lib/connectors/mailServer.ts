import * as nodemailer from 'nodemailer';
import { emailServer } from '../../config';
require('dotenv').config();

import { SimpleEmailAttributes, EmailCredentialsToVerify } from '../../models';


class MailServer {

    async send_mail(data: SimpleEmailAttributes): Promise<string> {

        try {


            if (!await this.verifyEmail({
                host: data?.host || process.env.MAIL_HOST,
                port: data?.port || Number(process.env.MAIL_PORT),
                secure: data?.secure || Number(process.env.MAIL_SECURE) ? true : false,
                email: data?.from_email || emailServer.info_email.auth.user,
                password: data?.from_psswd || emailServer.info_email.auth.password
            }))
                return Promise.reject({ code: 500, message: 'Email credentials are invalid, e-mail server is wrong or configuration closed unexpectable' });



            const transporter = nodemailer.createTransport({
                host: data?.host || process.env.MAIL_HOST,
                port: data?.port || Number(process.env.MAIL_PORT),
                secure: data?.secure || Number(process.env.MAIL_SECURE) ? true : false,
                auth: {
                    user: data?.from_email || emailServer.info_email.auth.user,
                    pass: data?.from_psswd || emailServer.info_email.auth.password,
                },
                tls: {
                    rejectUnauthorized: false
                }
            });


            let from: string;
            if (data?.from_email)
                if (data?.from_name)
                    from = `"${data.from_name}" <${data.from_email}>`;
                else
                    from = `"${emailServer.info_email.defaults.name}" <${data.from_email}>`;
            else
                from = `"${emailServer.info_email.defaults.name}" <${emailServer.info_email.defaults.email}>`;

            const mail = await transporter.sendMail({
                from: from,
                to: data.to,
                cc: data?.cc ? data.cc : null,
                bcc: data?.bcc ? data.bcc : null,
                subject: data.subject,
                text: data?.text ? data.text : null,
                html: data.html
            });

            return Promise.resolve(mail.messageId);

        } catch (error) {
            return Promise.reject(error);
        }

    }






    async verifyEmail(data: EmailCredentialsToVerify): Promise<boolean> {

        try {

            const transporter = nodemailer.createTransport({
                host: data?.host,
                port: data?.port,
                secure: data?.secure,
                auth: {
                    user: data?.email,
                    pass: data?.password,
                },
            });


            let transporter_status: boolean;
            await transporter.verify()
                .then(() => transporter_status = true)
                .catch(() => transporter_status = false);


            return Promise.resolve(transporter_status);

        } catch (error) {
            return Promise.reject(error);
        }

    }

}


const mailServer = new MailServer();
export { mailServer };
