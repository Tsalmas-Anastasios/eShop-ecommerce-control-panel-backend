export class AccountToken {

    token_id: string;
    connected_account_id: string;
    token_value: string;
    created_at?: string | Date;
    products_open: boolean;
    product_categories_open: boolean;
    newsletter_open: boolean;
    cart_checkout_open: boolean;
    type?: string;
    iat?: number;
    exp?: number;

    constructor(props?: AccountToken) {

        this.token_id = props?.token_id || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.token_value = props?.token_value || null;
        this.created_at = props?.created_at || null;
        this.products_open = props?.products_open || null;
        this.product_categories_open = props?.product_categories_open || null;
        this.newsletter_open = props?.newsletter_open || null;
        this.cart_checkout_open = props?.cart_checkout_open || null;
        this.type = props?.type || null;
        this.iat = props?.iat || null;
        this.exp = props?.exp || null;

    }

}



export class AccountTokenPermissions {

    products_open: boolean;
    product_categories_open: boolean;
    newsletter_open: boolean;
    cart_checkout_open: boolean;

    constructor(props?: AccountTokenPermissions) {

        this.products_open = props?.products_open || null;
        this.product_categories_open = props?.cart_checkout_open || null;
        this.newsletter_open = props?.newsletter_open || null;
        this.cart_checkout_open = props?.cart_checkout_open || null;

    }

}



export class AccountTokenIdentifiers {

    token_id: string;
    token_value: string;

    constructor(props?: AccountTokenIdentifiers) {

        this.token_id = props?.token_id || null;
        this.token_value = props?.token_value || null;

    }

}



export class AccountTokensSearchArgsGraphQLParams {

    token_id?: string;
    connected_account_id: string;

    constructor(props?: AccountTokensSearchArgsGraphQLParams) {

        this.token_id = props?.token_id || null;
        this.connected_account_id = props?.connected_account_id || null;

    }

}
