import { Company } from './Company';
import { UserPrivilege } from './UserPrivilege';

export class Account {

    id: string;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    password?: string;
    phone: string;
    profile_picture_url?: string;
    company_name?: string;
    activated?: boolean;
    request_password_change?: boolean;
    created_at?: Date | string;
    role?: string;
    using_bizyhive_cloud?: boolean;
    authentication_2fa__app?: boolean;
    authentication_2fa__email?: boolean;
    authentication_2fa__app_secret?: string;

    constructor(props?: Account) {

        this.id = props?.id || null;
        this.first_name = props?.first_name || null;
        this.last_name = props?.last_name || null;
        this.email = props?.email || null;
        this.username = props?.username || null;
        this.password = props?.password || null;
        this.phone = props?.phone || null;
        this.profile_picture_url = props?.profile_picture_url || null;
        this.company_name = props?.company_name || null;
        this.activated = props?.activated || false;
        this.request_password_change = props?.request_password_change || false;
        this.created_at = props?.created_at || null;
        this.role = props?.role || null;
        this.using_bizyhive_cloud = props?.using_bizyhive_cloud || true;
        this.authentication_2fa__app = props?.authentication_2fa__app || false;
        this.authentication_2fa__email = props?.authentication_2fa__email || false;
        this.authentication_2fa__app_secret = props?.authentication_2fa__app_secret || null;

    }

}

export class User {

    id: string;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    password: string;
    phone: string;
    profile_picture_url?: string;
    activated: boolean;
    request_password_change: boolean;
    created_at: Date | string;
    connected_account: string;
    is_account: boolean;
    role: string;
    role_name: string;
    using_bizyhive_cloud?: boolean;
    authentication_2fa__app: boolean;
    authentication_2fa__email: boolean;
    authentication_2fa__app_secret: string;

    // not in db
    sessions: {
        sid: string;
        expires: number;
        data: string;
    }[];

    company_data: Company;

    privileges: UserPrivilege[];

    constructor(props?: User) {

        this.id = props?.id || null;
        this.first_name = props?.first_name || null;
        this.last_name = props?.last_name || null;
        this.email = props?.email || null;
        this.username = props?.username || null;
        this.password = props?.password || null;
        this.phone = props?.phone || null;
        this.profile_picture_url = props?.profile_picture_url || null;
        this.activated = props?.activated || false;
        this.request_password_change = props?.request_password_change || false;
        this.created_at = props?.created_at || null;
        this.connected_account = props?.connected_account || null;
        this.is_account = props?.is_account || false;
        this.role = props?.role || null;
        this.role_name = props?.role_name || null;

        this.using_bizyhive_cloud = props?.using_bizyhive_cloud || null;

        this.authentication_2fa__app = props?.authentication_2fa__app || false;
        this.authentication_2fa__email = props?.authentication_2fa__email || false;
        this.authentication_2fa__app_secret = props?.authentication_2fa__app_secret || null;

        this.sessions = props?.sessions || [];

        this.company_data = props?.company_data || null;

        this.privileges = props?.privileges || [];

    }

}







export interface LoginAuthData {

    username: string;
    password: string;
    remember_me: boolean;

}


export class UserMergingData {

    id?: number;
    user_id: string;
    username: string;
    email: string;
    phone: string;
    connected_table: string;

    constructor(props?: UserMergingData) {

        this.id = props?.id || null;
        this.user_id = props?.user_id || null;
        this.username = props?.username || null;
        this.email = props?.email || null;
        this.phone = props?.phone || null;
        this.connected_table = props?.connected_table || null;

    }

}



export class AccountUserBasicImportantCommonData {

    id: string;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    password: string;
    phone: string;
    profile_picture_url?: string;
    activated: boolean;
    request_password_change: boolean;
    created_at: Date | string;
    role: string;
    authentication_2fa__app: boolean;
    authentication_2fa__email: boolean;
    authentication_2fa__app_secret: string;

    // not in db
    privileges?: UserPrivilege[];

    constructor(props?: AccountUserBasicImportantCommonData) {

        this.id = props?.id || null;
        this.first_name = props?.first_name || null;
        this.last_name = props?.last_name || null;
        this.email = props?.email || null;
        this.username = props?.username || null;
        this.password = props?.password || null;
        this.phone = props?.phone || null;
        this.profile_picture_url = props?.profile_picture_url || null;
        this.activated = props?.activated || false;
        this.request_password_change = props?.request_password_change || false;
        this.created_at = props?.created_at || null;
        this.role = props?.role || null;
        this.authentication_2fa__app = props?.authentication_2fa__app || false;
        this.authentication_2fa__email = props?.authentication_2fa__email || false;
        this.authentication_2fa__app_secret = props?.authentication_2fa__app_secret || null;

        this.privileges = props?.privileges || [];

    }

}




export interface AccountActivationData {

    key: string;

}


export interface ActivationKeyData {
    user_id: string;
    username: string;
    email: string;
    account_type: string;
    type: string;
    iat: number;
    exp: number;
}



export interface RequestNewPasswordData {
    username: string;               // username or email
}


export class GenerateTokenToChangePassword {

    id: string;
    username: string;
    email: string;
    account_type?: string;

    constructor(props?: GenerateTokenToChangePassword) {

        this.id = props?.id || null;
        this.username = props?.username || null;
        this.email = props?.email || null;
        this.account_type = props?.account_type || null;

    }

}


export interface ChangePasswordRequest {

    key: string;

}


export interface ChangePasswordRequestKeyContent {

    id?: string;
    user_id?: string;
    username: string;
    email: string;
    account_type: string;
    type: string;
    iat: number;
    exp: number;

}


export interface ChangePasswordNewPassword {

    id: string;
    password: string;
    confirm_password: string;
    account_type: string;

}




export class SaveDataFromLoginSession {

    login_id?: string;
    connected_account_id: string;
    user_account_id: string;
    session_id: string;
    expires: number;
    session_data: string;
    country_code: string;
    country_name: string;
    city: string;
    postal?: string;
    latitude: number;
    longitude: number;
    ipv4: string;
    ipv6?: string;
    state: string;
    using_bizyhive_cloud?: boolean;
    created_at?: string | Date;

    constructor(props?: SaveDataFromLoginSession) {

        this.login_id = props?.login_id || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.user_account_id = props?.user_account_id || null;
        this.session_id = props?.session_id || null;
        this.session_data = props?.session_data || null;
        this.country_code = props?.country_code || null;
        this.country_name = props?.country_name || null;
        this.city = props?.city || null;
        this.postal = props?.postal || null;
        this.latitude = props?.latitude || null;
        this.longitude = props?.longitude || null;
        this.ipv4 = props?.ipv4 || null;
        this.ipv6 = props?.ipv6 || null;
        this.state = props?.state || null;
        this.using_bizyhive_cloud = props?.using_bizyhive_cloud || null;
        this.created_at = props?.created_at || null;

    }

}





export interface SavedSessionDataFromDB {

    sid: string;
    expires: number;
    data: string;

}

