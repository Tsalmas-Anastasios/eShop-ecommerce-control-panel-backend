import { utils } from '../../lib/utils.service';
import { config } from '../../config';




class CompanyWarehousesIDNumbersGenerator {


    getWarehouseID(): string {
        return `cwrh_${utils.generateId(config.company_warehouses_id_chars_length, config.nanoid_alphabet)}`;
    }


    getRunwayID(): string {
        return `cwhrw_${utils.generateId(config.company_warehouses_runways_id_chars_length, config.nanoid_alphabet)}`;
    }


    getColumnID(): string {
        return `colcwh_${utils.generateId(config.company_warehouses_columns_id_chars_length, config.nanoid_alphabet)}`;
    }


    getShelfID(): string {
        return `shcolcwh_${utils.generateId(config.company_warehouses_shelf_id_chars_length, config.nanoid_alphabet)}`;
    }


}



const companyWarehousesIDNumbersGenerator = new CompanyWarehousesIDNumbersGenerator();
export { companyWarehousesIDNumbersGenerator };
