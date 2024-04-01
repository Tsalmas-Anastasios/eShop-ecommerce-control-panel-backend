import { Request } from 'express';
import {
    Company
} from '../models';
import { utils } from '../lib/utils.service';
import { mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';

import { companyDataIDGeneratorService } from './id_numbers_generators/company-data';






class CompanyDataGetService {


    async getCompanyData(params: { connected_account_id: string }, req?: Request): Promise<Company> {

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
                        company_data${graphQueryParams !== '()' ? graphQueryParams : ''}{
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

                            slug
                        }
                    }
                `,
                contextValue: req || null,
            });


            if (result.errors?.length > 0)
                return Promise.reject({ errors: result.errors, message: 'error in graphql query' });


            const companies_list: Company[] = result.data.company_data as Company[];


            if (companies_list.length === 0)
                return Promise.resolve(null);

            return Promise.resolve(companies_list[0]);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}




class CompanyDataPostAddNewService {


    async addNew(form_data: Company): Promise<string> {

        try {

            const rec_id = companyDataIDGeneratorService.getCompanyDataID();



            const result = await mysql.query(`
                INSERT INTO
                    companies
                SET
                    rec_id = :rec_id,
                    business_name = :business_name,
                    shop_name = :shop_name,
                    tax_id = :tax_id,
                    tax_authority = :tax_authority,
                    contact_person__first_name = :contact_person__first_name,
                    contact_person__last_name = :contact_person__last_name,
                    ${form_data?.contact_person__middle ? `contact_person__middle = '${form_data.contact_person__middle}',` : ``}
                    contact_email = :contact_email,
                    contact_phone = :contact_phone,
                    company_email = :company_email,
                    company_phone = :company_phone,
                    shop_url = :shop_url,
                    shop_type = :shop_type,
                    ${form_data?.products_categories ? `products_categories = '${JSON.stringify(form_data.products_categories)}',` : ``}
                    headquarters_address__street = :headquarters_address__street,
                    headquarters_address__city = :headquarters_address__city,
                    headquarters_address__postal_code = :headquarters_address__postal_code,
                    headquarters_address__state = :headquarters_address__state,
                    headquarters_address__country = :headquarters_address__country,
                    headquarters_longitude = :headquarters_longitude,
                    headquarters_latitude = :headquarters_latitude,
                    operating_hours__monday_start = :operating_hours__monday_start,
                    operating_hours__monday_end = :operating_hours__monday_end,
                    operating_hours__monday_close = :operating_hours__monday_close,
                    operating_hours__tuesday_start = :operating_hours__tuesday_start,
                    operating_hours__tuesday_end = :operating_hours__tuesday_end,
                    operating_hours__tuesday_close = :operating_hours__tuesday_close,
                    operating_hours__wednesday_start = :operating_hours__wednesday_start,
                    operating_hours__wednesday_end = :operating_hours__wednesday_end,
                    operating_hours__wednesday_close = :operating_hours__wednesday_close,
                    operating_hours__thursday_start = :operating_hours__thursday_start,
                    operating_hours__thursday_end = :operating_hours__thursday_end,
                    operating_hours__thursday_close = :operating_hours__thursday_close,
                    operating_hours__friday_start = :operating_hours__friday_start,
                    operating_hours__friday_end = :operating_hours__friday_end,
                    operating_hours__friday_close = :operating_hours__friday_close,
                    operating_hours__saturday_start = :operating_hours__saturday_start,
                    operating_hours__saturday_end = :operating_hours__saturday_end,
                    operating_hours__saturday_close = :operating_hours__saturday_close,
                    operating_hours__sunday_start = :operating_hours__sunday_start,
                    operating_hours__sunday_end = :operating_hours__sunday_end,
                    operating_hours__sunday_close = :operating_hours__sunday_close,
                    ${form_data?.facebook_url ? `facebook_url = '${form_data.facebook_url}',` : ``}
                    ${form_data?.instagram_url ? `instagram_url = '${form_data.instagram_url}',` : ``}
                    ${form_data?.twitter_url ? `twitter_url = '${form_data.twitter_url}',` : ``}
                    ${form_data?.tiktok_url ? `tiktok_url = '${form_data.tiktok_url}',` : ``}
                    ${form_data?.google_business_url ? `google_business_url = '${form_data.google_business_url}',` : ``}
                    ${form_data?.shop_google_rate_url ? `shop_google_rate_url = '${form_data.shop_google_rate_url}',` : ``}
                    ${form_data?.company_description ? `company_description = '${form_data.company_description}',` : ``}
                    shop_logo = :shop_logo,
                    connected_account_id = :connected_account_id,
                    coin_symbol = :coin_symbol,
                    coin_label = :coin_label,
                    coin_description = :coin_description,
                    coin_correspondence_in_eur = :coin_correspondence_in_eur,
                    coin_value = :coin_value,
                    fee_percent = :fee_percent,
                    slug = :slug
            `, {
                rec_id: rec_id,
                business_name: form_data.business_name,
                shop_name: form_data.shop_name,
                tax_id: form_data.tax_id,
                tax_authority: form_data.tax_authority,
                contact_person__first_name: form_data.contact_person__first_name,
                contact_person__last_name: form_data.contact_person__last_name,
                contact_email: form_data.contact_email,
                contact_phone: form_data.contact_phone,
                company_email: form_data.company_email,
                company_phone: form_data.company_phone,
                shop_url: form_data.shop_url,
                shop_type: form_data.shop_type,
                headquarters_address__street: form_data.headquarters_address__street,
                headquarters_address__city: form_data.headquarters_address__city,
                headquarters_address__postal_code: form_data.headquarters_address__postal_code,
                headquarters_address__state: form_data.headquarters_address__state,
                headquarters_address__country: form_data.headquarters_address__country,
                headquarters_longitude: Number(form_data.headquarters_longitude),
                headquarters_latitude: Number(form_data.headquarters_latitude),
                operating_hours__monday_start: form_data.operating_hours__monday_start,
                operating_hours__monday_end: form_data.operating_hours__monday_end,
                operating_hours__monday_close: form_data.operating_hours__monday_close ? 1 : 0,
                operating_hours__tuesday_start: form_data.operating_hours__tuesday_start,
                operating_hours__tuesday_end: form_data.operating_hours__tuesday_end,
                operating_hours__tuesday_close: form_data.operating_hours__tuesday_close ? 1 : 0,
                operating_hours__wednesday_start: form_data.operating_hours__wednesday_start,
                operating_hours__wednesday_end: form_data.operating_hours__wednesday_end,
                operating_hours__wednesday_close: form_data.operating_hours__wednesday_close ? 1 : 0,
                operating_hours__thursday_start: form_data.operating_hours__thursday_start,
                operating_hours__thursday_end: form_data.operating_hours__thursday_end,
                operating_hours__thursday_close: form_data.operating_hours__thursday_close ? 1 : 0,
                operating_hours__friday_start: form_data.operating_hours__friday_start,
                operating_hours__friday_end: form_data.operating_hours__friday_end,
                operating_hours__friday_close: form_data.operating_hours__friday_close ? 1 : 0,
                operating_hours__saturday_start: form_data.operating_hours__saturday_start,
                operating_hours__saturday_end: form_data.operating_hours__saturday_end,
                operating_hours__saturday_close: form_data.operating_hours__saturday_close ? 1 : 0,
                operating_hours__sunday_start: form_data.operating_hours__sunday_start,
                operating_hours__sunday_end: form_data.operating_hours__sunday_end,
                operating_hours__sunday_close: form_data.operating_hours__sunday_close ? 1 : 0,
                shop_logo: form_data.shop_logo,
                connected_account_id: form_data.connected_account_id,
                coin_symbol: form_data.coin_symbol,
                coin_label: form_data.coin_label,
                coin_description: form_data.coin_description,
                coin_correspondence_in_eur: form_data.coin_correspondence_in_eur,
                coin_value: form_data.coin_value,
                fee_percent: form_data.fee_percent,
                slug: form_data.slug
            });



            return Promise.resolve(rec_id);

        } catch (error) {
            return Promise.reject(error);
        }

    }

}





class CompanyDataPutUpdateService {

    async updateData(form_data: Company): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    companies
                SET
                    ${form_data?.business_name ? `business_name = '${form_data.business_name}',` : ``}
                    ${form_data?.shop_name ? `shop_name = '${form_data.shop_name}',` : ``}
                    ${form_data?.tax_id ? `tax_id = '${form_data.tax_id}',` : ``}
                    ${form_data?.tax_authority ? `tax_authority = '${form_data.tax_authority}',` : ``}
                    ${form_data?.contact_person__first_name ? `contact_person__first_name = '${form_data.contact_person__first_name}',` : ``}
                    ${form_data?.contact_person__middle ? `contact_person__middle = '${form_data.contact_person__middle}',` : ``}
                    ${form_data?.contact_person__last_name ? `contact_person__last_name = '${form_data.contact_person__last_name}',` : ``}
                    ${form_data?.contact_email ? `contact_email = '${form_data.contact_email}',` : ``}
                    ${form_data?.contact_phone ? `contact_phone = '${form_data.contact_phone}',` : ``}
                    ${form_data?.company_email ? `company_email = '${form_data.company_email}',` : ``}
                    ${form_data?.company_phone ? `company_phone = '${form_data.company_phone}',` : ``}
                    ${form_data?.shop_url ? `shop_url = '${form_data.shop_url}',` : ``}
                    ${form_data?.shop_type ? `shop_type = '${form_data.shop_type}',` : ``}
                    ${form_data?.products_categories ? `products_categories = '${form_data.products_categories}',` : ``}
                    ${form_data?.headquarters_address__street ? `headquarters_address__street = '${form_data.headquarters_address__street}',` : ``}
                    ${form_data?.headquarters_address__city ? `headquarters_address__city = '${form_data.headquarters_address__city}',` : ``}
                    ${form_data?.headquarters_address__postal_code ? `headquarters_address__postal_code = '${form_data.headquarters_address__postal_code}',` : ``}
                    ${form_data?.headquarters_address__state ? `headquarters_address__state = '${form_data.headquarters_address__state}',` : ``}
                    ${form_data?.headquarters_address__country ? `headquarters_address__country = '${form_data.headquarters_address__country}',` : ``}
                    ${form_data?.headquarters_longitude ? `headquarters_longitude = '${form_data.headquarters_longitude}',` : ``}
                    ${form_data?.headquarters_latitude ? `headquarters_latitude = '${form_data.headquarters_latitude}',` : ``}
                    ${form_data?.operating_hours__monday_start ? `operating_hours__monday_start = '${form_data.operating_hours__monday_start}',` : ``}
                    ${form_data?.operating_hours__monday_end ? `operating_hours__monday_end = '${form_data.operating_hours__monday_end}',` : ``}
                    ${form_data?.operating_hours__monday_close ? `operating_hours__monday_close = ${form_data.operating_hours__monday_close ? 1 : 0},` : ``}
                    ${form_data?.operating_hours__tuesday_start ? `operating_hours__tuesday_start = '${form_data.operating_hours__tuesday_start}',` : ``}
                    ${form_data?.operating_hours__tuesday_end ? `operating_hours__tuesday_end = '${form_data.operating_hours__tuesday_end}',` : ``}
                    ${form_data?.operating_hours__tuesday_close ? `operating_hours__tuesday_close = ${form_data.operating_hours__tuesday_close ? 1 : 0},` : ``}
                    ${form_data?.operating_hours__wednesday_start ? `operating_hours__wednesday_start = '${form_data.operating_hours__wednesday_start}',` : ``}
                    ${form_data?.operating_hours__wednesday_end ? `operating_hours__wednesday_end = '${form_data.operating_hours__wednesday_end}',` : ``}
                    ${form_data?.operating_hours__wednesday_close ? `operating_hours__wednesday_close = ${form_data.operating_hours__wednesday_close ? 1 : 0},` : ``}
                    ${form_data?.operating_hours__thursday_start ? `operating_hours__thursday_start = '${form_data.operating_hours__thursday_start}',` : ``}
                    ${form_data?.operating_hours__thursday_end ? `operating_hours__thursday_end = '${form_data.operating_hours__thursday_end}',` : ``}
                    ${form_data?.operating_hours__thursday_close ? `operating_hours__thursday_close = ${form_data.operating_hours__thursday_close ? 1 : 0},` : ``}
                    ${form_data?.operating_hours__friday_start ? `operating_hours__friday_start = '${form_data.operating_hours__friday_start}',` : ``}
                    ${form_data?.operating_hours__friday_end ? `operating_hours__friday_end = '${form_data.operating_hours__friday_end}',` : ``}
                    ${form_data?.operating_hours__friday_close ? `operating_hours__friday_close = ${form_data.operating_hours__friday_close ? 1 : 0},` : ``}
                    ${form_data?.operating_hours__saturday_start ? `operating_hours__saturday_start = '${form_data.operating_hours__saturday_start}',` : ``}
                    ${form_data?.operating_hours__saturday_end ? `operating_hours__saturday_end = '${form_data.operating_hours__saturday_end}',` : ``}
                    ${form_data?.operating_hours__saturday_close ? `operating_hours__saturday_close = ${form_data.operating_hours__saturday_close ? 1 : 0},` : ``}
                    ${form_data?.operating_hours__sunday_start ? `operating_hours__sunday_start = '${form_data.operating_hours__sunday_start}',` : ``}
                    ${form_data?.operating_hours__sunday_end ? `operating_hours__sunday_end = '${form_data.operating_hours__sunday_end}',` : ``}
                    ${form_data?.operating_hours__sunday_close ? `operating_hours__sunday_close = ${form_data.operating_hours__sunday_close ? 1 : 0},` : ``}
                    ${form_data?.facebook_url ? `facebook_url = '${form_data.facebook_url}',` : ``}
                    ${form_data?.instagram_url ? `instagram_url = '${form_data.instagram_url}',` : ``}
                    ${form_data?.twitter_url ? `twitter_url = '${form_data.twitter_url}',` : ``}
                    ${form_data?.linkedIn_url ? `linkedIn_url = '${form_data.linkedIn_url}',` : ``}
                    ${form_data?.youtube_url ? `youtube_url = '${form_data.youtube_url}',` : ``}
                    ${form_data?.whatsapp_url ? `whatsapp_url = '${form_data.whatsapp_url}',` : ``}
                    ${form_data?.tiktok_url ? `tiktok_url = '${form_data.tiktok_url}',` : ``}
                    ${form_data?.google_business_url ? `google_business_url = '${form_data.google_business_url}',` : ``}
                    ${form_data?.shop_google_rate_url ? `shop_google_rate_url = '${form_data.shop_google_rate_url}',` : ``}
                    ${form_data?.company_description ? `company_description = '${form_data.company_description}',` : ``}
                    ${form_data?.shop_logo ? `shop_logo = '${form_data.shop_logo}',` : ``}
                    ${form_data?.coin_symbol ? `coin_symbol = '${form_data.coin_symbol}',` : ``}
                    ${form_data?.coin_label ? `coin_label = '${form_data.coin_label}',` : ``}
                    ${form_data?.coin_description ? `coin_description = '${form_data.coin_description}',` : ``}
                    ${form_data?.coin_correspondence_in_eur ? `coin_correspondence_in_eur = '${form_data.coin_correspondence_in_eur}',` : ``}
                    ${form_data?.coin_value ? `coin_value = '${form_data.coin_value}',` : ``}
                    ${form_data?.fee_percent ? `fee_percent = '${form_data.fee_percent}',` : ``}
                    ${form_data?.slug ? `slug = '${form_data.slug}',` : ``}
                    rec_id = :rec_id
                WHERE
                    rec_id = :rec_id AND
                    connected_account_id = :connected_account_id;
            `, {
                rec_id: form_data.rec_id,
                connected_account_id: form_data.connected_account_id,
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }

}





const companyDataGetService = new CompanyDataGetService();
const companyDataPostAddNewService = new CompanyDataPostAddNewService();
const companyDataPutUpdateService = new CompanyDataPutUpdateService();
export {
    companyDataGetService, companyDataPostAddNewService, companyDataPutUpdateService
};
