import * as express from 'express';
import * as session from 'express-session';
import * as expressMySqlSession from 'express-mysql-session';
import { v4 as uuidv4 } from 'uuid';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as https from 'https';
require('dotenv').config();

import { mysql } from './lib/connectors/mysql';
import { utils } from './lib/utils.service';

// models
import { SessionDataObject } from './models';

// Routes
import { IndexRoutes } from './routes';
import { AuthRoutes } from './routes/auth';
import { OrdersRoutes } from './routes/orders';
import { OrderStatusRoutes } from './routes/order-status';
import { OrderProductsStatusRoutes } from './routes/order-products-statuses';
import { OrderProductsRoutes } from './routes/order-products';
import { OrdersSearchRoutes } from './routes/orders-search';
import { OrderTransactionsRoutes } from './routes/order-transactions';
import { ProductsRoutes } from './routes/products';
import { ProductImagesRoute } from './routes/product-images';
import { ProductStatusRoutes } from './routes/product-status';
import { ProductCategoriesRoutes } from './routes/product-categories';
import { ProductSearchRoutes } from './routes/product-search';
import { ProductTransactionsRoutes } from './routes/product-transactions';
import { SharedProductsRoutes } from './routes/share-products';
import { ContactsRoutes } from './routes/contacts';
import { ContactLabelsRoutes } from './routes/contact-labels';
import { ContactLabelsNamesRoutes } from './routes/contact-labels-names';
import { ContactAddressDataRoutes } from './routes/contact-addresses';
import { ContactCustomFieldsRoutes } from './routes/contacts-custom-fields';
import { ContactsEmailDataRoute } from './routes/contacts-email-data';
import { ContactPhonesDataRouting } from './routes/contact-phones-data';
import { NewsletterManagementAdminRoutes } from './routes/newsletter-admin';
import { CompanyDataRoutes } from './routes/company-data';
import { CompanyEmailDataRoutes } from './routes/company-email';
import { CompanyAPIConnectionKeyRoutes } from './routes/company-api-connection-key';
import { EmployeeDataRoutes } from './routes/employees';
import { EmployeePaymentDataRoutes } from './routes/employees-payments';
import { EmployeesDonePaymentsRoutes } from './routes/employees-done-payments';
import { EmployeesWorkHoursRoutes } from './routes/employees-work-hours';
import { OrderSummaryRoutes } from './routes/order-summary';
import { TotalSalesAmountRoutes } from './routes/total-sales-amount';
import { FamousProductsRoutes } from './routes/famous-products';
import { DashboardStatsRoutes } from './routes/dashboard-stats';
import { OrderPaymentMethodsRoutes } from './routes/order-payment-methods';
import { UserRoutes } from './routes/user';
import { Authentication2FARoutes } from './routes/authentication-2fa';
import { ConnectedUsersRoutes } from './routes/connected-users';
import { UserRolesRoutes } from './routes/user-roles';
import { CompanyWarehouseRoutes } from './routes/company-warehouses';
import { CompanyWarehouseRunwaysRoutes } from './routes/company-warehouses-runway';
import { CompanyWarehouseColumnsRoutes } from './routes/company-warehouses-columns';
import { CompanyWarehouseColumnsShelfRoutes } from './routes/company-warehouses-columns-shelf';
import { ShortingLinkRoutes } from './routes/shorting-link';
import { ProductsInventoryRoutes } from './routes/products-inventory';
import { ProductInventoryProductsRoutes } from './routes/product-inventory-products';
import { ProductsInventorySettingsRoutes } from './routes/products-inventory-settings';
import { DocumentationRoutes } from './routes/documentation/documentation-route';

// open api
import { ProductsListOpenAPIRoutes } from './routes/open/products-list';
import { ProductItemOpenAPIRoutes } from './routes/open/product-item';
import { ProductsSearchOpenAPIRoutes } from './routes/open/search-products';
import { NewsletterEmailOpenAPIRoutes } from './routes/open/newsletter-emails';



// cron jobs
import { TotalSalesAmountCalc } from './scheduled-tasks/total-sales-amount-calc';
import { OrdersCalcAutoCrons } from './scheduled-tasks/orders-calc';
import { FamousProductsCalc } from './scheduled-tasks/famous-products';
import { FamousProductsPerCategoryCalc } from './scheduled-tasks/famous-products-per-category';


const cron = require('node-cron');






declare module 'express-session' {
    export interface SessionData {
        user: SessionDataObject;
        created_at: string | Date;
    }
}


class Server {

    private server: express.Application;

    constructor() {

        this.server = express(); // create express application instance
        this.server.set('port', process.env.BACKEND_PORT); // define the port globally

        this.config();
        this.routes();
        this.initializeCronJobs();

    }



    private domains_list = [
        'http://localhost:4200'
    ];



    // Server configuration
    private config(): void {


        this.server.use(express.json({ limit: '32mb' })); // support application/json type post data
        this.server.use(express.urlencoded({ extended: false, limit: '32mb' })); // support application/x-www-form-urlencoded post data

        this.server.use(express.static(utils.path.join(__dirname, 'public')));


        // Handle user sessions
        const mySQLSessionStore = expressMySqlSession(session);
        const sessionStore = new mySQLSessionStore({
            checkExpirationInterval: 900000, // clear expired sessions every 15 minutes
            schema: {
                tableName: 'sessions',
                columnNames: {
                    session_id: 'sid',
                    expires: 'expires',
                    data: 'data'
                }
            }
        }, mysql._mysql.createPool(mysql.poolConfig));


        this.server.use(session({ // https://www.npmjs.com/package/express-session
            secret: 'ee37abdf-416d-40f3-b8c1-0d4d5563832f',
            name: 'bizyhiveECCP.sid',
            cookie: {
                httpOnly: true, // Ensures the cookie is sent only over HTTP(S), not client JavaScript, helping to protect against cross-site scripting attacks.
                secure: true, // Ensures the browser only sends the cookie over HTTPS.
                maxAge: 3 * 24 * 60 * 60 * 1000,
                sameSite: 'none',
            },
            saveUninitialized: false,
            resave: true,
            store: sessionStore, // mysql session store
            genid: (req: express.Request) => uuidv4()
        }));



        this.server.use(cors({
            // origin: '*',
            origin: (origin, callback) => {

                if (!origin)
                    return callback(null, true);

                if (!this.domains_list.includes(origin))
                    return callback(null, false);                // to block --> (null, false)

                return callback(null, true);
            },
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        }));

        this.server.use(async (req: express.Request, res: express.Response, next: express.NextFunction) => {

            res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Authorization, Content-Type, X-Content-Type-Options');

            next();

        });


        this.server.set('trust proxy', true);


        // routes tracker
        const accessLogStream = utils.fs.createWriteStream(
            utils.path.join(__dirname, 'access.log'),
            { flags: 'a' }
        );
        this.server.use(morgan(':method :url :status :res[content-length] - :response-time ms', { stream: accessLogStream }));




        // Start express server
        if (process.env.ENVIRONMENT_MODE === 'development') {

            const https_server = https.createServer({
                key: utils.fs.readFileSync(utils.path.join(__dirname, '/config/certs/server.key')),
                cert: utils.fs.readFileSync(utils.path.join(__dirname, '/config/certs/server.cert'))
            }, this.server);

            https_server.listen(this.server.get('port'), () => {
                console.log(`Bizyhive e-Commerce Control Panel - Copyright 20[2-9][0-9] - Adorithm Ltd`);
                console.log(`https://bizyhive.com`);
                console.log(`https://adorithm.com`);
                console.log(`Bizyhive suit Copyright © 20[0-9][0-9]`);
                console.log(`Adorithm Ltd Copyright © 20[0-9][0-9]`);
                console.log(`Server is running on port: ${this.server.get('port')}`);
            });

        } else
            this.server.listen(this.server.get('port'), () => {
                console.log(`Bizyhive e-Commerce Control Panel - Copyright 20[2-9][0-9] - Adorithm Ltd`);
                console.log(`https://bizyhive.com`);
                console.log(`https://adorithm.com`);
                console.log(`Bizyhive suit Copyright © 20[0-9][0-9]`);
                console.log(`Adorithm Ltd Copyright © 20[0-9][0-9]`);
                console.log(`Server is running on port: ${this.server.get('port')}`);
            });

    }



    // Server routing
    private routes(): void {

        new IndexRoutes().routes(this.server);                          // index routes (home pages for unauthorized and authorized users)
        new AuthRoutes().routes(this.server);                           // auth routes (like login, register, etc)
        new OrdersRoutes().routes(this.server);                         // routes for orders etc.
        new OrderStatusRoutes().routes(this.server);                    // change the status for the orders
        new OrderProductsStatusRoutes().routes(this.server);            // change the status for the products of the orders
        new OrderProductsRoutes().routes(this.server);                  // order products route etc.
        new OrderSummaryRoutes().routes(this.server);                   // routes to control order summary data (like counting orders, etc)
        new OrdersSearchRoutes().routes(this.server);                   // routes to search orders by many criteria
        new OrderTransactionsRoutes().routes(this.server);              // routes to control the order transactions
        new ProductsRoutes().routes(this.server);                       // routes for products
        new ProductImagesRoute().routes(this.server);                   // routes to upload product images
        new ProductStatusRoutes().routes(this.server);                  // routes to change product statuses
        new ProductCategoriesRoutes().routes(this.server);              // routes to control product categories by shops
        new ProductSearchRoutes().routes(this.server);                  // routes to search products by many criteria
        new ProductTransactionsRoutes().routes(this.server);            // routes to control the product transactions
        new SharedProductsRoutes().routes(this.server);                 // routes to control the sharing products
        new ContactsRoutes().routes(this.server);                       // routes to control contacts (display, edit, delete, add, etc)
        new ContactLabelsRoutes().routes(this.server);                  // routes to control contact labels
        new ContactLabelsNamesRoutes().routes(this.server);             // routes to control contact labels names
        new ContactAddressDataRoutes().routes(this.server);             // routes to control contact addresses
        new ContactCustomFieldsRoutes().routes(this.server);            // routes to control contact custom fields
        new ContactsEmailDataRoute().routes(this.server);               // routes to control contact email data
        new ContactPhonesDataRouting().routes(this.server);             // routes to control contact phone data
        new NewsletterManagementAdminRoutes().routes(this.server);      // routes to control newsletter system of the control panel (only the messages here)
        new CompanyDataRoutes().routes(this.server);                    // routes to control the company data
        new CompanyEmailDataRoutes().routes(this.server);               // routes to control company emails data
        new CompanyAPIConnectionKeyRoutes().routes(this.server);        // routes to control API keys from companies
        new EmployeeDataRoutes().routes(this.server);                   // routes to control employee data
        new EmployeePaymentDataRoutes().routes(this.server);            // routes to control employee payments data
        new EmployeesDonePaymentsRoutes().routes(this.server);          // routes to control employee done payments
        new EmployeesWorkHoursRoutes().routes(this.server);             // routes to control employee worked hours data
        new TotalSalesAmountRoutes().routes(this.server);               // routes to display the statistics of total sales amount
        new FamousProductsRoutes().routes(this.server);                 // routes to control famous products
        new DashboardStatsRoutes().routes(this.server);                 // routes to control the stats that display in the home screen - dashboard page
        new OrderPaymentMethodsRoutes().routes(this.server);            // routes to control order payment methods
        new UserRoutes().routes(this.server);                           // routes to handle the user's data
        new Authentication2FARoutes().routes(this.server);              // routes to handle and control the 2FA authentication for accounts
        new ConnectedUsersRoutes().routes(this.server);                 // routes to control the connected to an account users
        new UserRolesRoutes().routes(this.server);                      // routes to control the user roles
        new CompanyWarehouseRoutes().routes(this.server);               // routes to control the warehouses of the companies
        new CompanyWarehouseRunwaysRoutes().routes(this.server);        // routes to control the warehouse's runways of the companies
        new CompanyWarehouseColumnsRoutes().routes(this.server);        // routes to control the warehouse's columns (that belong to the runways) of the companies
        new CompanyWarehouseColumnsShelfRoutes().routes(this.server);   // routes to control the shelf of the warehouse's columns of the companies
        new ShortingLinkRoutes().routes(this.server);                   // routes to control the shorting link mechanism
        new ProductsInventoryRoutes().routes(this.server);              // routes to control the product inventories
        new ProductInventoryProductsRoutes().routes(this.server);       // routes to control the products for the product inventories
        new ProductsInventorySettingsRoutes().routes(this.server);      // routes to define & control the settings that defined for the products inventory
        new DocumentationRoutes().routes(this.server);                  // routes for the documentation

        // open API
        new ProductsListOpenAPIRoutes().routes(this.server);            // routes to display in a general-specific list the products from the store
        new ProductItemOpenAPIRoutes().routes(this.server);             // routes to display a specific product and its info and details
        new ProductsSearchOpenAPIRoutes().routes(this.server);          // routes to handle the products open search
        new NewsletterEmailOpenAPIRoutes().routes(this.server);         // routes to handle newsletter emails from the clients

    }




    private initializeCronJobs(): void {

        new TotalSalesAmountCalc().cronJobTotalSalesAmount();               // cron job to calculate the incomes (total sales labeled)
        new OrdersCalcAutoCrons().ordersCalcGeneral();                      // cron job to calculate the orders (general and with status)
        new FamousProductsCalc().cronJobFamousProducts();                   // cron job to calculate the famous products
        new FamousProductsPerCategoryCalc().cronJobFamousProductsPerCategory();         // cron job to calculate the famous products per category

    }

}


const server = new Server();
