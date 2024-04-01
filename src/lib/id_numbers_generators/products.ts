import { utils } from '../../lib/utils.service';
import { config } from '../../config';


class ProductsIDNumbersGenerator {

    getNewProductID(): string {
        return `prd_${utils.generateId(config.product_id_chars_length, config.nanoid_alphabet)}`;
    }

    getNewProductNumber(): string {
        return `${utils.generateId(config.product_code_chars_length, config.product_code_alphabet)}-${utils.generateId(config.product_code_chars_length, config.product_code_alphabet)}`;
    }


    getNewSpecificationCategoryID(): string {
        return utils.generateId(config.product_specification_categories_id_length, config.nanoid_alphabet);
    }

    getNewSpecificationFieldID(): string {
        return utils.generateId(config.product_specification_fields_id_length, config.nanoid_alphabet);
    }


    getNewHistoryProductID(): string {
        return `hprod_${utils.generateId(config.history_product_id_length, config.nanoid_alphabet)}`;
    }

    getNewFamousProductID(): string {
        return `fpc_${utils.generateId(config.famous_product_id_chars_length, config.nanoid_alphabet)}`;
    }

    getProductStockID(): string {
        return utils.generateId(config.product_stock_warehouses_chars_length_id, config.nanoid_alphabet);
    }

}



const productsIDNumbersGenerator = new ProductsIDNumbersGenerator();
export { productsIDNumbersGenerator };
