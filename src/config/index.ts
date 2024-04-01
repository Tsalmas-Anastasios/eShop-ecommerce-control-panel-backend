require('dotenv').config();


class Config {

    public unauthorized_routes_allowed: string[];

    public open_api_routes = {
        products_open: [],
        product_categories_open: [],
        newsletter_open: [],
        cart_checkout_open: [],
    };

    public dev_params: any;
    public SECRET_KEY_FOR_ACTIVATION_LINK: string;
    public SECRET_KEY_FOR_PASSWORD_CHANGE: string;
    public SECRET_KEY_FOR_API_TOKEN: string;
    public nanoid_alphabet: string;
    public idcount_chars_create_user_acc: number;
    public order_number_length: number;
    public order_number_alphabet: string;
    public order_id_random_chars_length: number;
    public order_payment_type_id_chars_length: number;
    public order_products_id_chars_length: number;
    public orders_calculator_id_chars_length: number;

    public transfer_couriers_id_chars_length: number;
    public transfer_couriers_types_id_chars_length: number;

    public invoice_number_length: number;

    public product_id_chars_length: number;
    public product_code_chars_length: number;
    public product_code_alphabet: string;
    public product_images_id_chars_length: number;
    public product_categories_id_chars_length: number;
    public product_specification_categories_id_length: number;
    public product_specification_fields_id_length: number;
    public product_stock_warehouses_chars_length_id: number;
    public user_roles_id_length: number;
    public order_tracking_number_ID_length: number;
    public order_costs_number_ID_length: number;
    public order_paper_id_chars_length: number;
    public history_product_id_length: number;
    public famous_product_id_chars_length: number;


    public cron_jobs_types: string[];

    // contact id-numbers generator
    public contact_id_chars_length: number;
    public contact_labels_id_chars_length: number;
    public contact_label_name_id_chars_length: number;
    public contact_address_id_chars_length: number;
    public contact_custom_field_id_chars_length: number;
    public contact_email_id_chars_length: number;
    public contact_phone_id_chars_length: number;



    // fileStorage name generators
    public productImagesName_length: number;
    public productImagesName_alphabet: string;
    public orderPapersName_length: number;
    public orderPapersName_alphabet: string;
    public profilePictureName_length: number;
    public profilePictureName_alphabet: string;
    public companyLogoName_length: number;
    public companyLogoName_alphabet: string;


    // newsletter id-numbers generator
    public newsletter_message_id_chars_length: number;
    public newsletter_client_email_id_chars_length: number;


    public company_api_connection_token_id_chars_length: number;
    public company_data_id_length_chars: number;


    // employees id-numbers generator
    public employee_id_chars_length: number;
    public employee_payments_version_id_chars_length: number;
    public employee_done_payments_id_chars_length: number;
    public employee_worked_hours_id_chars_length: number;


    // company email id-numbers generator
    public company_email_id_chars_length: number;



    // total sales monthly id-numbers generator
    public total_sales_amount_id_chars_length: number;


    // company warehouses
    public company_warehouses_id_chars_length: number;
    public company_warehouses_runways_id_chars_length: number;
    public company_warehouses_columns_id_chars_length: number;
    public company_warehouses_shelf_id_chars_length: number;


    // url
    public activation_link_live: string;
    public invited_user_activation_link_live: string;
    public password_change_request_link_live: string;
    public bizyhive_google_rate_url: string;
    public web_app_home_url: string;
    public mother_company_url: string;


    // products inventory system
    public products_inventory_id_chars_length: number;
    public product_inventories_products_id_chars_length: number;


    // contacts
    public contacts_photo_nameLength: number;
    public contacts_photo_name_alphabet: string;


    constructor() {

        this.unauthorized_routes_allowed = [
            '/',
            '/api/auth/login',
            '/api/auth/register',
            '/api/auth/email-activation',
            '/api/auth/request-new-password',
            '/api/auth/check-password-change-token',
            '/api/auth/email-activation',
        ];

        this.dev_params = {
            localhost: {
                front: 'http://localhost:4200',
                back: '',
            },
        };

        this.SECRET_KEY_FOR_ACTIVATION_LINK = process.env.SECRET_KEY_FOR_ACTIVATION_LINK;
        this.SECRET_KEY_FOR_PASSWORD_CHANGE = process.env.SECRET_KEY_FOR_PASSWORD_CHANGE;
        this.SECRET_KEY_FOR_API_TOKEN = process.env.SECRET_KEY_FOR_API_TOKEN;
        this.nanoid_alphabet = '0123456789ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@$^*_-=';
        this.idcount_chars_create_user_acc = 18;
        this.order_number_length = 10;
        this.order_number_alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_';           // order_number_part1-order_number_part2
        this.order_id_random_chars_length = 36;
        this.order_payment_type_id_chars_length = 36;
        this.order_products_id_chars_length = 36;
        this.orders_calculator_id_chars_length = 36;

        this.transfer_couriers_id_chars_length = 36;
        this.transfer_couriers_types_id_chars_length = 36;

        this.invoice_number_length = 18;

        this.product_id_chars_length = 36;
        this.product_code_chars_length = 10;
        this.product_code_alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_';           // product_number_part1-product_number_part2
        this.product_images_id_chars_length = 36;
        this.product_categories_id_chars_length = 36;
        this.product_specification_categories_id_length = 36;
        this.product_specification_fields_id_length = 36;
        this.product_stock_warehouses_chars_length_id = 36;
        this.user_roles_id_length = 36;
        this.order_tracking_number_ID_length = 36;
        this.order_costs_number_ID_length = 36;
        this.order_paper_id_chars_length = 36;
        this.history_product_id_length = 36;
        this.famous_product_id_chars_length = 36;

        this.cron_jobs_types = ['general', 'yearly', 'monthly', 'weekly'];

        // contact id-numbers generator
        this.contact_id_chars_length = 36;
        this.contact_labels_id_chars_length = 36;
        this.contact_label_name_id_chars_length = 36;
        this.contact_address_id_chars_length = 36;
        this.contact_custom_field_id_chars_length = 36;
        this.contact_email_id_chars_length = 36;
        this.contact_phone_id_chars_length = 36;


        // newsletter id-numbers generator
        this.newsletter_message_id_chars_length = 36;
        this.newsletter_client_email_id_chars_length = 36;


        // company email id-numbers generator
        this.company_email_id_chars_length = 36;



        // total sales monthly id-numbers generator
        this.total_sales_amount_id_chars_length = 36;


        this.company_warehouses_id_chars_length = 36;
        this.company_warehouses_runways_id_chars_length = 36;


        this.company_api_connection_token_id_chars_length = 36;
        this.company_data_id_length_chars = 36;
        this.company_warehouses_columns_id_chars_length = 36;



        // employees id-numbers generator
        this.employee_id_chars_length = 36;
        this.employee_payments_version_id_chars_length = 36;
        this.employee_done_payments_id_chars_length = 36;
        this.employee_worked_hours_id_chars_length = 36;


        // fileStorage name generators
        this.productImagesName_length = 30;
        this.productImagesName_alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890)(_-';
        this.orderPapersName_length = 36;
        this.orderPapersName_alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890)(_-';
        this.profilePictureName_length = 36;
        this.profilePictureName_alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890)(_-';
        this.companyLogoName_length = 36;
        this.companyLogoName_alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890)(_-';

        // url
        this.activation_link_live = process.env.ACCOUNT_ACTIVATION_LINK_LIVE;
        this.invited_user_activation_link_live = process.env.INVITED_USER_ACTIVATION_LINK_LIVE;
        this.password_change_request_link_live = process.env.ACCOUNT_PASSWORD_CHANGE_REQUEST_LINK_LIVE;
        this.bizyhive_google_rate_url = process.env.BIZYHIVE_GOOGLE_RATE_URL;
        this.web_app_home_url = process.env.WEB_APP_URL;
        this.mother_company_url = process.env.MOTHER_COMPANY_WEBSITE_URL;


        // products inventory
        this.products_inventory_id_chars_length = 36;
        this.product_inventories_products_id_chars_length = 64;


        // contacts
        this.contacts_photo_nameLength = 36;
        this.contacts_photo_name_alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890)(_-';

    }

}



class DatabaseConfig {

    public mysql: any;


    constructor() {

        this.mysql = {
            host: process.env.MAIN_DB_HOST,
            port: process.env.MAIN_DB_PORT,
            user: process.env.MAIN_DB_USER,
            password: process.env.MAIN_DB_PASSWORD,
            database: process.env.MAIN_DB_DATABASE_NAME,
            multipleStatements: process.env.MAIN_DB_MULTIPLE_STATEMENTS,
            charset: process.env.MAIN_DB_CHARSET,
            character_set_server: process.env.MAIN_DB_CHARACTER_SET_SERVER,
            connection_limit: process.env.MAIN_DB_CONNECTION_LIMIT,
            timezone: process.env.MAIN_DB_TIMEZONE,
        };

    }

}








// email server
class EmailServer {

    public info_email: any;
    public orders_email: any;
    public accounts_email: any;
    public newsletter_email: any;
    public errors_email: any;

    constructor() {

        this.info_email = {
            host: process.env.INFO_EMAIL_HOST,
            port: process.env.INFO_EMAIL_PORT,
            secure: process.env.INFO_EMAIL_SECURE_CONNECTION,
            auth: {
                user: process.env.INFO_EMAIL_AUTH_USER,
                password: process.env.INFO_EMAIL_AUTH_PASSWORD,
            },
            defaults: {
                name: process.env.INFO_EMAIL_DEFAULT_NAME,
                email: process.env.INFO_EMAIL_DEFAULT_EMAIL,
            },
        };

        this.orders_email = {
            host: process.env.ORDERS_EMAIL_HOST,
            port: process.env.ORDERS_EMAIL_PORT,
            secure: process.env.ORDERS_EMAIL_SECURE_CONNECTION,
            auth: {
                user: process.env.ORDERS_EMAIL_AUTH_USER,
                password: process.env.ORDERS_EMAIL_AUTH_PASSWORD,
            },
            defaults: {
                name: process.env.ORDERS_EMAIL_DEFAULT_NAME,
                email: process.env.ORDERS_EMAIL_DEFAULT_EMAIL,
            }
        };

        this.accounts_email = {
            host: process.env.ACCOUNTS_EMAIL_HOST,
            port: process.env.ACCOUNTS_EMAIL_PORT,
            secure: process.env.ACCOUNTS_EMAIL_SECURE_CONNECTION,
            auth: {
                user: process.env.ACCOUNTS_EMAIL_AUTH_USER,
                password: process.env.ACCOUNTS_EMAIL_AUTH_PASSWORD
            },
            defaults: {
                name: process.env.ACCOUNTS_EMAIL_DEFAULT_NAME,
                email: process.env.ACCOUNTS_EMAIL_DEFAULT_EMAIL,
            }
        };

        this.newsletter_email = {
            host: process.env.NEWSLETTER_EMAIL_HOST,
            port: process.env.NEWSLETTER_EMAIL_PORT,
            secure: process.env.NEWSLETTER_EMAIL_SECURE_CONNECTION,
            auth: {
                user: process.env.NEWSLETTER_EMAIL_AUTH_USER,
                password: process.env.NEWSLETTER_EMAIL_AUTH_PASSWORD,
            },
            defaults: {
                name: process.env.NEWSLETTER_EMAIL_DEFAULT_NAME,
                email: process.env.NEWSLETTER_EMAIL_DEFAULT_EMAIL,
            }
        };

        this.errors_email = {
            host: process.env.ERRORS_EMAIL_HOST,
            port: process.env.ERRORS_EMAIL_PORT,
            secure: process.env.ERRORS_EMAIL_SECURE_CONNECTION,
            auth: {
                user: process.env.ERRORS_EMAIL_AUTH_USER,
                password: process.env.ERRORS_EMAIL_AUTH_PASSWORD,
            },
            defaults: {
                name: process.env.ERRORS_EMAIL_DEFAULT_NAME,
                email: process.env.ERRORS_EMAIL_DEFAULT_EMAIL,
            }
        };

    }

}

const config = new Config();
const dbConfig = new DatabaseConfig();
const emailServer = new EmailServer();

export { config, dbConfig, emailServer };

