import { Request } from 'express';
import {
    ProductsInventoriesSettings, ProductInventoriesSettingsAutoGenerationTimeline
} from '../models';
import { utils } from '../lib/utils.service';
import { mysql } from '../lib/connectors/mysql';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';





class GetProductInventoriesSettingsService {



    async getSettings(connected_account_id: string, fields: string[], req?: Request): Promise<ProductsInventoriesSettings> {

        try {


            const result = await graphql({
                schema: schema,
                source: `
                {
                    productInventoriesSettings(connected_account_id: "${utils.findAccountIDFromSessionObject(req)}"){

                        ${fields.includes('auto_generation_timeline') ? `
                            auto_generation_timeline{
                                setting_id
                                type
                                value
                                setting_auto_generate_date__day
                                setting_auto_generate_date__month
                                setting_auto_generate_date_frequency
                                setting_auto_generate_date_frequency__day
                                setting_auto_generate_date_frequency__month
                            }
                        ` : ``}

                    }
                }`,
                contextValue: req || null
            });



            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });


            const settings_list: ProductsInventoriesSettings[] = result.data.productInventoriesSettings as ProductsInventoriesSettings[];

            if (settings_list.length <= 0)
                return Promise.resolve(null);

            return Promise.resolve(settings_list[0]);

        } catch (error) {
            return Promise.reject(error);
        }

    }



}




const getProductInventoriesSettingsService = new GetProductInventoriesSettingsService();
export { getProductInventoriesSettingsService };
