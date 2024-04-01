import { utils } from '../../lib/utils.service';
import { config } from '../../config';





class TotalSalesAmountIDNumberGenerator {

    getNewTotalSalesID(): string {
        return `tsm_${utils.generateId(config.total_sales_amount_id_chars_length, config.nanoid_alphabet)}`;
    }

}



const totalSalesAmountIDNumberGenerator = new TotalSalesAmountIDNumberGenerator();
export { totalSalesAmountIDNumberGenerator };
