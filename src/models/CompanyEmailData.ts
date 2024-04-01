export class CompanyEmailData {

    email_id?: string;
    connected_account_id: string;
    email_label: string;
    host: string;
    port: number;
    secure: boolean;
    user: string;
    password: string;
    default_name: string;
    default_email: string;

    constructor(props?: CompanyEmailData) {

        this.email_id = props?.email_id || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.email_label = props?.email_label || null;
        this.host = props?.host || null;
        this.port = props?.port || null;
        this.secure = props?.secure || null;
        this.user = props?.user || null;
        this.password = props?.password || null;
        this.default_name = props?.default_name || null;
        this.default_email = props?.default_email || null;

    }

}




export interface CompanyEmailSearchDataArgsGraphQL {

    email_id?: string;
    connected_account_id: string;

}
