export class CompanyWarehouse {

    warehouse_id?: string;
    connected_account_id: string;
    distinctive_title: string;
    code_name: string;
    ownership_type: 'privately_owned' | 'rental' | 'granting' | 'other';
    square_meters: number;
    power_type: 'three_phase' | 'single_phase';
    warehouse_license_number: string;
    building_permit_number: string;
    building_year: string;
    reception_exist: boolean;
    parking_spaces: number;
    unloading_vehicles_places_number: number;
    energy_class: string;
    bathrooms_number: number;
    offices_number: number;
    plot__street: string;
    plot__postal_code: string;
    plot__country: string;
    plot__city: string;
    plot__state: string;
    plot__latitude: number;
    plot__longitude: number;
    contact__street: string;
    contact__postal_code: string;
    contact__country: string;
    contact__city: string;
    contact__state: string;
    contact__latitude: number;
    contact__longitude: number;
    contact__phone: string;
    warehouse_manager__fullname: string;
    warehouse_manager__company_position: string;
    warehouse_manager__date_of_birth: string | Date;
    warehouse_manager__social_security_number: string;
    warehouse_manager__personal_tax_id: string;
    warehouse_manager__phone: string;
    warehouse_manager__phone2: string;
    warehouse_manager__company_email: string;
    warehouse_manager__personal_email: string;


    // not in db
    runways?: CompanyWarehouseRunway[];

    constructor(props?: CompanyWarehouse) {

        this.warehouse_id = props?.warehouse_id || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.distinctive_title = props?.distinctive_title || null;
        this.code_name = props?.code_name || null;
        this.ownership_type = props?.ownership_type || null;
        this.square_meters = props?.square_meters || 0;
        this.power_type = props?.power_type || null;
        this.warehouse_license_number = props?.warehouse_license_number || null;
        this.building_permit_number = props?.building_permit_number || null;
        this.building_year = props?.building_year || null;
        this.reception_exist = props?.reception_exist ? true : false;
        this.parking_spaces = props?.parking_spaces || 0;
        this.unloading_vehicles_places_number = props?.unloading_vehicles_places_number || 0;
        this.energy_class = props?.energy_class || null;
        this.bathrooms_number = props?.bathrooms_number || 0;
        this.offices_number = props?.offices_number || 0;
        this.plot__street = props?.plot__street || null;
        this.plot__postal_code = props?.plot__postal_code || null;
        this.plot__country = props?.plot__country || null;
        this.plot__city = props?.plot__city || null;
        this.plot__latitude = props?.plot__latitude || 0;
        this.plot__longitude = props?.plot__longitude || 0;
        this.contact__street = props?.contact__street || null;
        this.contact__postal_code = props?.contact__postal_code || null;
        this.contact__country = props?.contact__country || null;
        this.contact__city = props?.contact__city || null;
        this.contact__state = props?.contact__state || null;
        this.contact__latitude = props?.contact__latitude || 0;
        this.contact__longitude = props?.contact__longitude || 0;
        this.contact__phone = props?.contact__phone || null;
        this.warehouse_manager__fullname = props?.warehouse_manager__fullname || null;
        this.warehouse_manager__company_position = props?.warehouse_manager__company_position || null;
        this.warehouse_manager__date_of_birth = props?.warehouse_manager__date_of_birth || null;
        this.warehouse_manager__social_security_number = props?.warehouse_manager__social_security_number || null;
        this.warehouse_manager__personal_tax_id = props?.warehouse_manager__personal_tax_id || null;
        this.warehouse_manager__phone = props?.warehouse_manager__phone || null;
        this.warehouse_manager__phone2 = props?.warehouse_manager__phone2 || null;
        this.warehouse_manager__company_email = props?.warehouse_manager__company_email || null;
        this.warehouse_manager__personal_email = props?.warehouse_manager__personal_email || null;

        // not in db
        this.runways = props?.runways || [];

    }

}





export class CompanyWarehouseRunway {

    runway_id?: string;
    connected_account_id?: string;
    warehouse_id?: string;
    runway_name: string;
    runway_code: string;

    // not in db
    columns?: CompanyWarehouseColumn[];

    constructor(props?: CompanyWarehouseRunway) {

        this.runway_id = props?.runway_id || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.warehouse_id = props?.warehouse_id || null;
        this.runway_name = props?.runway_name || null;
        this.runway_code = props?.runway_code || null;

        // not in db
        this.columns = props?.columns || [];

    }

}




export class CompanyWarehouseColumn {

    column_id?: string;
    connected_account_id?: string;
    warehouse_id?: string;
    runway_id?: string;
    column_name: string;
    column_code: string;


    // not in db
    shelf?: CompanyWarehouseColumnShelf[];

    constructor(props?: CompanyWarehouseColumn) {

        this.column_id = props?.column_id || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.warehouse_id = props?.warehouse_id || null;
        this.runway_id = props?.runway_id || null;
        this.column_name = props?.column_name || null;
        this.column_code = props?.column_code || null;

        // not in db
        this.shelf = props?.shelf || [];

    }

}




export class CompanyWarehouseColumnShelf {

    shelf_id?: string;
    connected_account_id?: string;
    warehouse_id?: string;
    runway_id?: string;
    column_id?: string;
    shelf_code: string;

    constructor(props?: CompanyWarehouseColumnShelf) {

        this.shelf_id = props?.shelf_id || null;
        this.connected_account_id = props?.connected_account_id || null;
        this.warehouse_id = props?.warehouse_id || null;
        this.runway_id = props?.runway_id || null;
        this.column_id = props?.column_id || null;
        this.shelf_code = props?.shelf_code || null;

    }

}

