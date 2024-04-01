import { utils } from '../../lib/utils.service';
import { config } from '../../config';




class ProductsInventoryIdGenerator {


    getNewInventoryID(): string {
        return `pinv_${utils.generateId(config.products_inventory_id_chars_length, config.nanoid_alphabet)}`;
    }


}



const productsInventoryIdGenerator = new ProductsInventoryIdGenerator();
export { productsInventoryIdGenerator };
