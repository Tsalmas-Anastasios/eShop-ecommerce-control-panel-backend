import { Company } from './Company';
import { UserPrivilege } from './UserPrivilege';

export interface SessionDataObject {

    user_id: string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    phone: string;
    profile_picture_url?: string;
    created_at: string;
    role: string;
    is_account: boolean;
    connected_account?: string;
    using_bizyhive_cloud?: boolean;
    account_type: string;
    authentication_2fa__app: boolean;
    authentication_2fa__email: boolean;
    authentication_2fa__app_secret: string;

    company_data?: Company;

    privileges?: UserPrivilege[];

}
