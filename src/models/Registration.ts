export class RegistrationData {

    id?: string;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    password: string;
    confirm_password: string;
    phone: string;
    company_name?: string;
    connected_account?: string;
    is_account: boolean;
    role: string;
    using_bizyhive_cloud?: boolean;

    constructor(props?: RegistrationData) {

        this.id = props?.id || null;
        this.first_name = props?.first_name || null;
        this.last_name = props?.last_name || null;
        this.email = props?.email || null;
        this.username = props?.username || null;
        this.password = props?.password || null;
        this.confirm_password = props?.confirm_password || null;
        this.phone = props?.phone || null;
        this.company_name = props?.company_name || 'Adorithm Ltd';
        this.connected_account = props?.connected_account || null;
        this.is_account = props?.is_account || false;
        this.role = props?.role || null;
        this.using_bizyhive_cloud = props?.using_bizyhive_cloud || null;

    }

}

export class AccountRegistrationData {

    first_name: string;
    last_name: string;
    email: string;
    username: string;
    password: string;
    phone: string;
    company_name: string;
    role: string;
    using_bizyhive_cloud: boolean;

    constructor(props?: AccountRegistrationData) {

        this.first_name = props?.first_name || null;
        this.last_name = props?.last_name || null;
        this.email = props?.email || null;
        this.username = props?.username || null;
        this.password = props?.password || null;
        this.phone = props?.phone || null;
        this.company_name = props?.company_name || null;
        this.role = props?.role || null;
        this.using_bizyhive_cloud = props?.using_bizyhive_cloud || true;

    }

}


export class UserRegistrationData {

    first_name: string;
    last_name: string;
    email: string;
    username: string;
    password: string;
    phone: string;
    connected_account: string;
    role: string;

    constructor(props?: UserRegistrationData) {

        this.first_name = props?.first_name || null;
        this.last_name = props?.last_name || null;
        this.email = props?.email || null;
        this.username = props?.username || null;
        this.password = props?.password || null;
        this.phone = props?.phone || null;
        this.connected_account = props?.connected_account || null;
        this.role = props?.role || null;

    }

}
