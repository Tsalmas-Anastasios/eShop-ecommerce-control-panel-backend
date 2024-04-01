import { ContactLabel } from './index';
import { ContactAddressData } from './ContactAddressData';
import { ContactCustomFields } from './ContactCustomFields';
import { ContactEmailData } from './ContactEmailData';
import { ContactPhoneData } from './ContactPhoneData';

export class Contact {

    contact_id?: string;
    connected_account_id?: string;
    image_url?: string;
    prefix?: string;
    name: string;
    father_name?: string;
    surname?: string;
    suffix?: string;
    mother_name?: string;
    name_in_speaking_format?: string;
    father_name_in_speaking_format?: string;
    alias?: string;
    archive_as?: string;
    company?: string;
    work_position_title?: string;
    work_department?: string;
    date_of_birth?: string | Date;
    website?: string;
    notes?: string;
    private?: boolean;
    private_user_id?: string;
    favorite?: boolean;



    // not in db
    contact_labels?: ContactLabel[];
    addresses?: ContactAddressData[];
    custom_fields?: ContactCustomFields[];
    emails?: ContactEmailData[];
    phones?: ContactPhoneData[];

    constructor(props?: Contact) {

        this.contact_id = props?.contact_id || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.image_url = props?.image_url || null;
        this.prefix = props?.prefix || null;
        this.name = props?.name || null;
        this.father_name = props?.father_name || null;
        this.surname = props?.surname || null;
        this.suffix = props?.suffix || null;
        this.mother_name = props?.mother_name || null;
        this.name_in_speaking_format = props?.name_in_speaking_format || null;
        this.father_name_in_speaking_format = props?.father_name_in_speaking_format || null;
        this.alias = props?.alias || null;
        this.archive_as = props?.archive_as || null;
        this.company = props?.company || null;
        this.work_position_title = props?.work_position_title || null;
        this.work_department = props?.work_department || null;
        this.date_of_birth = props?.date_of_birth || null;
        this.website = props?.website || null;
        this.notes = props?.notes || null;
        this.private = props?.private ? true : false;
        this.private_user_id = props?.private_user_id || null;
        this.favorite = props?.favorite ? true : false;

    }

}





export class ContactSearchDataArgs {

    contact_id?: string;
    connected_account_id?: string;
    name?: string;
    father_name?: string;
    surname?: string;
    mother_name?: string;
    alias?: string;
    company?: string;
    work_position_title?: string;
    contact_label_id?: string;
    contact_label_str?: string;
    phone_number?: string;
    contact_email?: string;
    private?: number;
    private_user_id?: string;
    favorite?: number;
    page?: number;

    constructor(props?: ContactSearchDataArgs) {

        this.contact_id = props?.contact_id || undefined;
        this.connected_account_id = props?.connected_account_id || undefined;
        this.name = props?.name || undefined;
        this.father_name = props?.father_name || undefined;
        this.surname = props?.surname || undefined;
        this.mother_name = props?.mother_name || undefined;
        this.alias = props?.alias || undefined;
        this.company = props?.company || undefined;
        this.work_position_title = props?.work_position_title || undefined;
        this.contact_label_id = props?.contact_label_id || undefined;
        this.contact_label_str = props?.contact_label_str || undefined;
        this.phone_number = props?.phone_number || undefined;
        this.contact_email = props?.contact_email || undefined;
        this.private = props?.private ? 1 : 0;
        this.private_user_id = props?.private_user_id || undefined;
        this.favorite = props?.favorite || undefined;
        this.page = props?.page || undefined;

    }

}
