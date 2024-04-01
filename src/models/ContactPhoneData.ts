export class ContactPhoneData {

    rec_id?: string;
    label: string;
    phone: string;
    connected_account_id?: string;
    contact_id?: string;

    constructor(props?: ContactPhoneData) {

        this.rec_id = props?.rec_id || null;
        this.label = props?.label || null;
        this.phone = props?.phone || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.contact_id = props?.contact_id || null;

    }

}



export interface ContactPhoneDataSearchGraphQLData {

    rec_id?: string;
    connected_account_id: string;
    contact_id: string;

}
