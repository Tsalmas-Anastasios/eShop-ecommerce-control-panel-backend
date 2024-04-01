import { CronJob } from 'cron';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { utils } from '../lib/utils.service';
import { createdAtCreationStringService } from './services/created_at-creation.service';
import { postProductInventoryService } from '../lib/product-inventory.service';
import { getProductInventoriesSettingsService } from '../lib/product-inventory-settings.service';
import { ProductsInventoriesSettings, ProductInventoriesSettingsAutoGenerationTimeline, Account } from '../models';
import { productsInventoryIdGenerator } from '../lib/id_numbers_generators/products-inventory';




export class GenerateAutomaticallyProductInventoriesReports {


    private cronJobGenerateAutomaticallyProductInventoriesReports = '* * * */1 * *';




    public cronJobTotalSalesAmount(): CronJob {

        return new CronJob(this.cronJobGenerateAutomaticallyProductInventoriesReports, async () => {


            const today = utils.moment(new Date()).format('MM/DD/YYYY');
            const splitted_today = today.split('/');



            // get accounts here
            let accounts: string[] = [];
            try {

                accounts = await utils.getActivatedAccounts();

            } catch (error) {
                console.log('Error in exiting query.', error);
            }





            for (const account_id of accounts) {

                const promises: [
                    Promise<ProductsInventoriesSettings>,
                    Promise<Account>
                ] = [

                        getProductInventoriesSettingsService.getSettings(account_id, ['auto_generation_timeline'], null),

                        new Promise(async (resolve, reject) => {

                            try {

                                const account_email_result = await mysql.query(`SELECT * FROM accounts WHERE id = :id`, { id: account_id });

                                const account: Account = {
                                    id: account_id,
                                    first_name: account_email_result.rows[0].first_name.toString(),
                                    last_name: account_email_result.rows[0].last_name.toString(),
                                    email: account_email_result.rows[0].email.toString(),
                                    username: account_email_result.rows[0].username.toString(),
                                    phone: account_email_result.rows[0].phone.toString(),
                                };


                                resolve(account);

                            } catch (error) {
                                reject(error);
                            }

                        }),

                    ];


                let auto_gen_setting: ProductsInventoriesSettings;
                let account: Account;
                [
                    auto_gen_setting,
                    account
                ] = await Promise.all(promises);



                let inventory_response = null;
                if ((auto_gen_setting.auto_generation_timeline.setting_auto_generate_date__day === splitted_today[1] && auto_gen_setting.auto_generation_timeline.setting_auto_generate_date__month === splitted_today[0])
                    || (auto_gen_setting.auto_generation_timeline.setting_auto_generate_date_frequency === 'yearly'
                        && auto_gen_setting.auto_generation_timeline.setting_auto_generate_date_frequency__month === splitted_today[0]
                        && auto_gen_setting.auto_generation_timeline.setting_auto_generate_date_frequency__day === splitted_today[1])
                    || (auto_gen_setting.auto_generation_timeline.setting_auto_generate_date_frequency === 'monthly'
                        && auto_gen_setting.auto_generation_timeline.setting_auto_generate_date_frequency__day === splitted_today[1])
                    || (auto_gen_setting.auto_generation_timeline.setting_auto_generate_date_frequency === 'weekly'
                        && auto_gen_setting.auto_generation_timeline.setting_auto_generate_date_frequency__day === utils.moment().day().toString())
                    || (auto_gen_setting.auto_generation_timeline.setting_auto_generate_date_frequency === 'daily'))
                    inventory_response = await postProductInventoryService.createNewProductInventoryReport({
                        user_data: {
                            user_id: account.id,
                            first_name: account.first_name,
                            last_name: account.last_name
                        },
                        connected_account_id: account_id,
                        current_status: 'in_stock',
                        page: 1,
                        inventory_id: productsInventoryIdGenerator.getNewInventoryID(),
                        descriptive_title: `Auto generated inventory - ${utils.moment(new Date()).format('MM/DD/YYYY')}`,
                        send_email: true
                    }, null, account);


            }



        }, null, true, 'Europe/Athens');

    }


}
