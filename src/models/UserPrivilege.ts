export class UserPrivilege {

    rec_id: number;
    privilege_type: string;
    value: boolean;
    user_id: string;
    connected_account_id: string;

    constructor(props?: UserPrivilege) {

        this.rec_id = props?.rec_id || null;
        this.privilege_type = props?.privilege_type || null;
        this.value = props?.value ? true : false;
        this.user_id = props?.user_id || null;
        this.connected_account_id = props?.connected_account_id || null;

    }

}
