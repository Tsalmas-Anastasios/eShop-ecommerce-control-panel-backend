export class ContactLabel {

    rec_id?: string;
    label_id?: string;
    label?: string;
    connected_account_id?: string;
    contact_id?: string;

    constructor(props?: ContactLabel) {

        this.rec_id = props?.rec_id || null;
        this.label_id = props?.label_id || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.contact_id = props?.contact_id || null;

    }

}
