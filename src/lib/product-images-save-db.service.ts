import { Request } from 'express';
import {
    Product, GraphQlSearchProductsParamsArgs, GraphQlSearchProductsParamsArgsSpecificList,
    GraphQlSearchProductsParamsArgsSpecificProduct, ProductHistory, SaveNewProductImage
} from '../models';
import { utils } from '../lib/utils.service';
import { QueryResult, mysql } from '../lib/connectors/mysql';
import { config } from '../config';
import { graphql } from 'graphql';
import { schema } from '../graphql/Schema';

import { productImagesIDNUmbersGeneratorService } from './id_numbers_generators/product-images';
import * as dotenv from 'dotenv';




class SaveNewProductImageService {


    async saveNewImage(data: SaveNewProductImage): Promise<string> {

        try {

            const image_id = productImagesIDNUmbersGeneratorService.getImageId();
            const result = await mysql.query(`
                INSERT INTO
                    product_images_storage
                SET
                    id = :id,
                    url = :url,
                    main_image = :main_image,
                    product_id = :product_id,
                    archived = :archived,
                    connected_account_id = :connected_account_id,
                    product_version = :product_version
            `, {
                id: image_id,
                url: `${process.env.PRODUCT_IMAGES_STORAGE_FOLDER}${data.filename}`,
                main_image: data?.main_image || 0,
                product_id: data.product_id,
                archived: data?.archived || 0,
                connected_account_id: data.connected_account_id,
                product_version: data.product_version,
            });

            return Promise.resolve(image_id);

        } catch (error) {
            return Promise.reject(error);
        }

    }

}


class DeleteProductImageService {

    async deleteProductImage(image_id: string, account_id: string): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    product_images_storage
                SET
                    archived = 1
                WHERE
                    id = :id AND
                    connected_account_id = :connected_account_id;
            `, {
                id: image_id,
                connected_account_id: account_id,
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }

}



class CheckProductImagesService {


    async isMainImage(image_id: string, account_id: string): Promise<boolean> {

        try {

            const result = await mysql.query(`
                SELECT
                    main_image
                FROM
                    product_images_storage
                WHERE
                    id = :id AND
                    connected_account_id = :connected_account_id;
            `, {
                id: image_id,
                connected_account_id: account_id,
            });


            if (result.rowsCount === 0)
                return Promise.resolve(false);


            return Promise.resolve(result.rows[0].main_image as boolean);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}



class SetProductImageAsMainService {

    async setMainImage(data: { product_id: string, image_id: string, connected_account_id: string }): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    products_images_storage
                SET
                    main_image = 0
                WHERE
                    id <> :image_id AND
                    product_id = :product_id AND
                    connected_account_id = :connected_account_id
            `, {
                image_id: data.image_id,
                product_id: data.product_id,
                connected_account_id: data.connected_account_id,
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }


    async setRandomImageAsMainWithDateDESC(data: { product_id, connected_account_id: string }): Promise<void> {

        try {

            const result = await mysql.query(`
                UPDATE
                    product_images_storage
                SET
                    main_image = 1
                WHERE
                    id = (SELECT
                            id
                        FROM
                            product_images
                        WHERE
                            product_id = :product_id_select AND
                            connected_account_id = :connected_account_id_select
                        ORDER BY
                            created_at
                        DESC
                            LIMIT 1)
                    product_id = :product_id AND
                    connected_account_id = :connected_account_id;
            `, {
                product_id_select: data.product_id,
                connected_account_id_select: data.connected_account_id,
                product_id: data.product_id,
                connected_account_id: data.connected_account_id,
            });

        } catch (error) {
            return Promise.reject(error);
        }

    }

}



class GetRandomProductService {


    async getProductIdFromImageId(data: { image_id: string, connected_account_id: string }): Promise<string> {

        try {

            const result = await mysql.query(`
                SELECT
                    product_id
                FROM
                    product_images_storage
                WHERE
                    id = :id AND
                    connected_account_id = :connected_account_id;
            `, {
                id: data.image_id,
                connected_account_id: data.connected_account_id,
            });

            if (result.rowsCount === 0)
                return Promise.resolve(null);

            return Promise.resolve(result.rows[0].product_id as string);

        } catch (error) {
            return Promise.reject(error);
        }

    }


}






const saveNewProductImageService = new SaveNewProductImageService();
const deleteProductImageService = new DeleteProductImageService();
const checkProductImagesService = new CheckProductImagesService();
const setProductImageAsMainService = new SetProductImageAsMainService();
const getRandomProductService = new GetRandomProductService();
export {
    saveNewProductImageService, deleteProductImageService, checkProductImagesService, setProductImageAsMainService,
    getRandomProductService
};
