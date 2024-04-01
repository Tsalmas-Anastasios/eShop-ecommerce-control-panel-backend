export class ContactLabelName {

    label_id?: string;
    label?: string;
    connected_account_id?: string;

    constructor(props?: ContactLabelName) {

        this.label_id = props?.label_id || null;
        this.label = props?.label || null;
        this.connected_account_id = props?.connected_account_id || null;

    }

}
