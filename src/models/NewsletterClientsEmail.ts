export class NewsletterClientEmailData {

    rec_id?: string;
    client_email: string;
    client_name?: string;
    connected_account_id: string;

    constructor(props?: NewsletterClientEmailData) {

        this.rec_id = props?.rec_id || null;
        this.client_email = props?.client_email || null;
        this.client_name = props?.client_name || null;
        this.connected_account_id = props?.connected_account_id || null;

    }

}




export interface NewsletterClientEmailSearchParamsArgsData {

    rec_id?: string;
    connected_account_id?: string;

}

