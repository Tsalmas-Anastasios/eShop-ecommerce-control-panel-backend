import { Application, Request, Response, request } from 'express';
import {
    Company
} from '../models';
import { utils } from '../lib/utils.service';
import { mysql } from '../lib/connectors/mysql';
import {
    companyDataGetService, companyDataPostAddNewService, companyDataPutUpdateService
} from '../lib/company-data.service';
import { companyLogoFileStorage } from '../lib/connectors/fileStorage/company-logo';
require('dotenv').config();



export class CompanyDataRoutes {


    public routes(server: Application) {


        // get company data here
        server.route('/api/settings/company-data/get')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const connected_account_id = utils.findAccountIDFromSessionObject(req);
                    const company_data: Company = await companyDataGetService.getCompanyData({ connected_account_id: connected_account_id }, req);


                    return res.status(200).send(company_data);

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null, errors: error?.errors || null }, res);
                }

            });





        // save logo
        server.route('/api/settings/company-data/save-logo')
            .post(utils.checkAuth, companyLogoFileStorage.diskStorage.single('company_logo'), async (req: Request, res: Response) => {

                try {


                    req.session.user.company_data.shop_logo = `${process.env.COMPANY_LOGO_STORAGE_FOLDER}/${req.file.filename}`;



                    // image saved successfully
                    return res.status(200).send({
                        code: 200,
                        type: 'logo_saved',
                        message: 'Company\'s logo saved successfully',
                        originalname: req.file.originalname,
                        mimetype: req.file.mimetype,
                        destination: req.file.destination,
                        filename: req.file.filename,
                        file_url: `${process.env.COMPANY_LOGO_STORAGE_FOLDER}/${req.file.filename}`,
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });





        // add company data
        server.route('/api/settings/company-data/add-new-rec')
            .post(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const form_data: Company = req.body;
                    form_data.connected_account_id = utils.findAccountIDFromSessionObject(req);


                    // check if all data are submitted
                    if (!form_data?.business_name || !form_data?.shop_name || !form_data?.tax_id
                        || !form_data?.tax_authority || !form_data?.contact_person__first_name || !form_data?.contact_person__last_name
                        || !form_data?.contact_email || !form_data?.contact_phone || !form_data?.company_email
                        || !form_data?.company_phone || !form_data?.shop_url || !form_data?.shop_type
                        || !form_data?.headquarters_address__street || !form_data?.headquarters_address__city
                        || !form_data?.headquarters_address__postal_code || !form_data?.headquarters_address__state
                        || !form_data?.headquarters_address__country || !form_data?.headquarters_longitude
                        || !form_data?.headquarters_latitude || !form_data?.operating_hours__monday_start || !form_data?.operating_hours__monday_end
                        || !form_data?.operating_hours__tuesday_start || !form_data?.operating_hours__tuesday_end
                        || !form_data?.operating_hours__wednesday_start || !form_data?.operating_hours__wednesday_end
                        || !form_data?.operating_hours__thursday_start || !form_data?.operating_hours__thursday_end
                        || !form_data?.operating_hours__friday_start || !form_data?.operating_hours__friday_end
                        || !form_data?.operating_hours__saturday_start || !form_data?.operating_hours__saturday_end
                        || !form_data?.operating_hours__sunday_start || !form_data?.operating_hours__sunday_end
                        || !form_data?.shop_logo || !form_data?.coin_symbol || !form_data?.coin_label || !form_data?.coin_description
                        || !form_data?.coin_correspondence_in_eur)
                        return utils.errorHandlingReturn({
                            code: 400,
                            type: 'missing_data',
                            message: 'Missing data to be added',
                        }, res);



                    const new_record_id = await companyDataPostAddNewService.addNew(form_data);



                    req.session.user.company_data = form_data;




                    return res.status(200).send({
                        code: 200,
                        type: 'company_data_saved',
                        message: 'Company data saved successfully!',
                        rec_id: new_record_id,
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });




        // update company's data
        server.route('/api/settings/company-data/update/:rec_id')
            .put(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const form_data: Company = {
                        rec_id: req.params.rec_id,
                        ...req.body,
                        connected_account_id: utils.findAccountIDFromSessionObject(req),
                    };



                    try {

                        if (!form_data?.rec_id)
                            return utils.errorHandlingReturn({
                                code: 400,
                                type: 'missing_data',
                                message: 'Missing data and cannot be updated'
                            }, res);




                        // update from data
                        await companyDataPutUpdateService.updateData(form_data);


                    } catch (error) {
                        return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                    }





                    // if user changed the fee percent, should be changed on every product and order
                    if (req.session.user.company_data.fee_percent !== form_data.fee_percent)
                        try {

                            // change the fees on the products
                            const result = await mysql.query(`
                                UPDATE
                                    products
                                SET
                                    fee_percent = ${form_data.fee_percent},
                                    fees = ${form_data.fee_percent / 100} * clear_price
                            `);


                        } catch (error) {
                            return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                        }




                    req.session.user.company_data = form_data;





                    return res.status(200).send({
                        code: 200,
                        type: 'company_data_updated',
                        message: 'Company\'s data updated'
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });




        // check if slug exists
        server.route('/api/settings/company-data/slug/check-exists')
            .get(utils.checkAuth, async (req: Request, res: Response) => {

                try {

                    const new_slug = req.query?.new_slug?.toString() || null;
                    const current_slug = req.session.user.company_data.slug;
                    let exists = false;

                    if (current_slug !== new_slug && new_slug !== null) {

                        const result = await mysql.query(`SELECT company_id FROM companies WHERE slug = :new_slug`, { new_slug: new_slug });

                        if (result.rowsCount > 0)
                            exists = true;

                    }



                    return res.status(200).send({ exists: exists });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });


    }


}
