export class ContactCustomFields {

    rec_id?: string;
    label: string;
    value: string;
    connected_account_id?: string;
    contact_id?: string;

    constructor(props?: ContactCustomFields) {

        this.rec_id = props?.rec_id || null;
        this.label = props?.label || null;
        this.value = props?.value || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.contact_id = props?.contact_id || null;

    }

}



export interface ContactCustomFieldsArgumentsSearchListGraphQL {

    rec_id?: string;
    connected_account_id?: string;
    contact_id?: string;

}
