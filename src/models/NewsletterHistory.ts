import { NewsletterMessagesHistoryClientsEmailLists } from './NewsletterMessagesHistoryClientsEmailLists';



export class NewsletterHistoryMessages {

    message_id?: string;
    connected_account_id: string;
    subject: string;
    message: string;
    status?: 'draft' | 'sent' | 'archived';
    created_at?: string | Date;
    last_update_date?: string | Date;
    sent_at?: string | Date;


    // not in db
    emails?: NewsletterMessagesHistoryClientsEmailLists[];

    constructor(props?: NewsletterHistoryMessages) {

        this.message_id = props?.message_id || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.subject = props?.subject || null;
        this.message = props?.message || null;
        this.status = props?.status || null;
        this.created_at = props?.created_at || null;
        this.last_update_date = props?.last_update_date || null;
        this.sent_at = props?.sent_at || null;


        // not in db
        this.emails = props?.emails || null;

    }

}



export interface NewsletterHistoryMessagesSearchParamsDataArgsGraphQL {

    message_id?: string;
    connected_account_id: string;

}
