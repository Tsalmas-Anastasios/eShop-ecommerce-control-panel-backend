import { utils } from '../utils.service';
import { config } from '../../config';



class ProductCategoriesIDNumbersGenerator {

    getNewProductCategoryID(): string {
        return `pcg_${utils.generateId(config.product_categories_id_chars_length, config.nanoid_alphabet)}`;
    }

}


const productCategoriesIDNumbersGenerator = new ProductCategoriesIDNumbersGenerator();
export { productCategoriesIDNumbersGenerator };
