import { Application, Request, Response, request } from 'express';
import { utils } from '../lib/utils.service';
import { QueryResult, mysql } from '../lib/connectors/mysql';

import { productImagesFileStorage } from '../lib/connectors/fileStorage/productImages';
import {
    saveNewProductImageService, deleteProductImageService, checkProductImagesService, setProductImageAsMainService,
    getRandomProductService
} from '../lib/product-images-save-db.service';
import { checkProductService, updateProductDataService } from '../lib/products.service';
import { productImagesIDNUmbersGeneratorService } from '../lib/id_numbers_generators/product-images';
import * as dotenv from 'dotenv';




export class ProductImagesRoute {

    public routes(server: Application) {


        server.route('/api/ecommerce/store/products/:product_id/upload-multiple-image')                  // ?main_image=index
            .post(utils.checkAuth, productImagesFileStorage.diskStorage.array('product_image'), async (req: Request, res: Response) => {

                const user_id: string = req.session.user.user_id.toString();

                try {

                    const account_id = utils.findAccountIDFromSessionObject(req);
                    const product_id: string = req.params.product_id;
                    const main_image_index: number = Number(req.query?.main_image) || -1;

                    const files = req.files;
                    if (Number(files.length) <= 0)
                        return res.status(200).send({ code: 201, type: 'no_files_found_to_save', message: 'No files found to be saved' });



                    // user uses bizyhive cloud
                    if (req.session.user.using_bizyhive_cloud) {
                        // check if the product is exist
                        if (!await checkProductService.productExists({ product_id: product_id, connected_account_id: account_id }))
                            return utils.errorHandlingReturn({ code: 404, type: 'product_not_found', message: 'Product doesn\'t exist on this account' }, res);


                        let result = await mysql.query(`SELECT current_version FROM products WHERE product_id = '${product_id}'`);
                        const product_version = result.rows[0].current_version.toString();


                        let query_string = '';
                        for (let i = 0; i < Number(files.length); i++)
                            query_string += `
                                INSERT INTO
                                    product_images_storage
                                SET
                                    id = '${productImagesIDNUmbersGeneratorService.getImageId()}',
                                    url = '${process.env.PRODUCT_IMAGES_STORAGE_FOLDER}${files[i].filename}',
                                    main_image = ${main_image_index === i ? 1 : 0},
                                    product_id = '${product_id}',
                                    connected_account_id = '${account_id}',
                                    product_version = '${product_version}';
                            `;



                        await updateProductDataService.createProductTransactions({
                            product_id: product_id,
                            connected_account_id: account_id,
                            updated_by: user_id,
                            product_update_images: true,
                        });



                        result = await mysql.query(query_string);

                    }




                    return res.status(200).send({
                        code: 200,
                        type: 'images_uploaded',
                        message: 'Product images uploaded successfully',
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });







        server.route('/api/ecommerce/store/products/:product_id/upload-image')
            .post(utils.checkAuth, productImagesFileStorage.diskStorage.single('product_image'), async (req: Request, res: Response) => {

                const user_id: string = req.session.user.user_id.toString();


                try {

                    const account_id = utils.findAccountIDFromSessionObject(req);
                    const filename = req.file.filename;
                    const product_id = req.params.product_id;
                    const main_image = Number(req.query?.main_image) || 0;





                    // user uses bizyhive cloud
                    if (req.session.user.using_bizyhive_cloud) {
                        // check if the product is exist
                        if (!await checkProductService.productExists({ product_id: product_id, connected_account_id: account_id }))
                            return utils.errorHandlingReturn({ code: 404, type: 'product_not_found', message: 'Product doesn\'t exist on this account' }, res);


                        // find product version here
                        const result = await mysql.query(`SELECT current_version FROM products WHERE product_id = '${product_id}'`);
                        const product_version = result.rows[0].current_version.toString();


                        const image_id = await saveNewProductImageService.saveNewImage({
                            filename: filename,
                            product_id: product_id,
                            main_image: main_image,
                            connected_account_id: account_id,
                            product_version: product_version,
                        });




                        await updateProductDataService.createProductTransactions({
                            product_id: product_id,
                            connected_account_id: account_id,
                            updated_by: user_id,
                            product_update_images: true,
                        });



                        // set as main image (if submitted)
                        if (req.body?.main_image && (req.body.main_image === 1 || req.body.main_image === true))
                            await setProductImageAsMainService.setMainImage({
                                product_id: product_id,
                                image_id: image_id,
                                connected_account_id: account_id,
                            });

                    }




                    return res.status(200).send({
                        code: 200,
                        type: 'file_uploaded',
                        message: 'file_uploaded_successfully',
                        originalname: req.file.originalname,
                        mimetype: req.file.mimetype,
                        destination: req.file.destination,
                        filename: req.file.filename,
                    });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });



        // delete an image (set as archived)
        server.route('/api/ecommerce/store/products/images/delete/:image_id')
            .delete(utils.checkAuth, async (req: Request, res: Response) => {

                const user_id: string = req.session.user.user_id.toString();

                try {

                    const image_id = req.params.image_id;

                    const account_id = utils.findAccountIDFromSessionObject(req);


                    if (req.session.user.using_bizyhive_cloud) {

                        const product_id = await getRandomProductService.getProductIdFromImageId({ image_id: image_id, connected_account_id: account_id });
                        await deleteProductImageService.deleteProductImage(image_id, account_id);

                        await updateProductDataService.createProductTransactions({
                            product_id: product_id,
                            connected_account_id: account_id,
                            updated_by: user_id,
                            product_update_images: true,
                        });

                        if (!await checkProductImagesService.isMainImage(image_id, account_id))
                            return res.status(200).send({ code: 200, type: 'image_archived', message: 'Image archived successfully' });



                        await setProductImageAsMainService.setRandomImageAsMainWithDateDESC({ product_id: product_id, connected_account_id: account_id });

                    }

                    return res.status(201).send({ code: 201, type: 'image_archived_changed_main_image', message: 'Product image archived successfully! Main image changed!' });

                } catch (error) {
                    return utils.errorHandlingReturn({ code: 500, type: 'internal_server_error', message: error?.message || null }, res);
                }

            });

    }

}
