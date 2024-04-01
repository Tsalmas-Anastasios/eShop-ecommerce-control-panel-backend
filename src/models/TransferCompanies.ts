export class TransferCompanyData {

    rec_id?: string;
    name: string;
    type: string;
    description: string;
    banner_url: string;
    main_url: string;
    tracking_basic_url: string;
    integrated: boolean;

    constructor(props?: TransferCompanyData) {

        this.rec_id = props?.rec_id || null;
        this.name = props?.name || null;
        this.type = props?.type || null;
        this.description = props?.description || null;
        this.banner_url = props?.banner_url || null;
        this.main_url = props?.main_url || null;
        this.tracking_basic_url = props?.tracking_basic_url || null;
        this.integrated = props?.integrated || false;

    }

}


export class TransferCompanyTypesData {

    rec_id?: string;
    type_description: string;

    constructor(props?: TransferCompanyTypesData) {

        this.rec_id = props?.rec_id || null;
        this.type_description = props?.type_description || null;

    }

}
