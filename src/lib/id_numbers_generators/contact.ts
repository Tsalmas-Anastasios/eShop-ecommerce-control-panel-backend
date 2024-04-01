import { utils } from '../../lib/utils.service';
import { config } from '../../config';




class ContactNumbersIDGeneratorService {

    contactID(): string {
        return `cnt_${utils.generateId(config.contact_id_chars_length, config.nanoid_alphabet)}`;
    }

    contactLabelID(): string {
        return `cls_${utils.generateId(config.contact_labels_id_chars_length, config.nanoid_alphabet)}`;
    }

    contactLabelNameID(): string {
        return `cln_${utils.generateId(config.contact_label_name_id_chars_length, config.nanoid_alphabet)}`;
    }

    contactAddressID(): string {
        return `cad_${utils.generateId(config.contact_address_id_chars_length, config.nanoid_alphabet)}`;
    }

    contactCustomFieldID(): string {
        return `ccf_${utils.generateId(config.contact_custom_field_id_chars_length, config.nanoid_alphabet)}`;
    }

    contactEmailID(): string {
        return `ced_${utils.generateId(config.contact_email_id_chars_length, config.nanoid_alphabet)}`;
    }

    contactPhoneID(): string {
        return `cpd_${utils.generateId(config.contact_phone_id_chars_length, config.nanoid_alphabet)}`;
    }

}



const contactNumbersIDGeneratorService = new ContactNumbersIDGeneratorService();
export { contactNumbersIDGeneratorService };
