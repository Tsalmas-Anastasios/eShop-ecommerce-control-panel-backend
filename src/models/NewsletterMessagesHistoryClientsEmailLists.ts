export class NewsletterMessagesHistoryClientsEmailLists {

    rec_id?: string;
    connected_account_id?: string;
    message_id?: string;
    email_id: string;

    // not in db
    email?: string;

    constructor(props?: NewsletterMessagesHistoryClientsEmailLists) {

        this.rec_id = props?.rec_id || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.message_id = props?.message_id || null;
        this.email_id = props?.email_id || null;

        // not in db
        this.email = props?.email || null;

    }

}
