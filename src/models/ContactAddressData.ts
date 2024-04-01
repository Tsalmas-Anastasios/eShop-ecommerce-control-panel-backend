export class ContactAddressData {

    rec_id?: string;
    country: string;
    address: string;
    address_line_2?: string;
    postal_code: string;
    city: string;
    postal_vault: string;
    connected_account_id: string;
    contact_id: string;

    constructor(props?: ContactAddressData) {

        this.rec_id = props?.rec_id || null;
        this.country = props?.country || null;
        this.address = props?.address || null;
        this.address_line_2 = props?.address_line_2 || null;
        this.postal_code = props?.postal_code || null;
        this.city = props?.city || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.contact_id = props?.contact_id || null;

    }

}
