import { utils } from '../../lib/utils.service';
import { config } from '../../config';



class TransferCouriersIDGenerator {

    getNewTransferCourierID(): string {
        return `trc_${utils.generateId(config.transfer_couriers_id_chars_length, config.nanoid_alphabet)}`;
    }

    getNewTransferCourierTypeID(): string {
        return `tct_${utils.generateId(config.transfer_couriers_types_id_chars_length, config.nanoid_alphabet)}`;
    }

}


const transferCouriersIDGenerator = new TransferCouriersIDGenerator();
export { transferCouriersIDGenerator };
