import { utils } from '../../lib/utils.service';
import { config } from '../../config';


class AccountUserIDGenerator {

    getNewIdACCOUNT(): string {
        return `acc_${utils.generateId(config.idcount_chars_create_user_acc, config.nanoid_alphabet)}`;
    }

    getNewUSER(): string {
        return `usr_${utils.generateId(config.idcount_chars_create_user_acc, config.nanoid_alphabet)}`;
    }

    getNewUserRoleID(): string {
        return utils.generateId(config.user_roles_id_length, config.nanoid_alphabet);
    }

    getNewUserPrivilegeID(): string {
        return utils.generateId(48, config.nanoid_alphabet);
    }

}

const accountUserIDGenerator = new AccountUserIDGenerator();
export { accountUserIDGenerator };
