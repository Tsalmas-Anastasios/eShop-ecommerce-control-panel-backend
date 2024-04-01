import { utils } from '../../lib/utils.service';
import { config } from '../../config';


class ProductImagesIDNUmbersGeneratorService {

    getImageId(): string {
        return `pim_${utils.generateId(config.product_images_id_chars_length, config.nanoid_alphabet)}`;
    }

}



const productImagesIDNUmbersGeneratorService = new ProductImagesIDNUmbersGeneratorService();
export { productImagesIDNUmbersGeneratorService };
