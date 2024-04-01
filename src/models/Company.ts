

export class Company {

    rec_id?: string;
    business_name: string;
    shop_name: string;
    tax_id: string;
    tax_authority: string;
    contact_person__first_name: string;
    contact_person__last_name: string;
    contact_person__middle: string;
    contact_email: string;
    contact_phone: string;
    company_email: string;
    company_phone: string;
    shop_url: string;
    shop_type: string;
    products_categories?: string;


    // headquarters address
    headquarters_address__street: string;
    headquarters_address__city: string;
    headquarters_address__postal_code: string;
    headquarters_address__state: string;
    headquarters_address__country: string;
    headquarters_longitude: number;
    headquarters_latitude: number;

    // operating hours
    operating_hours__monday_start: string;         // time format HH:mm
    operating_hours__monday_end: string;         // time format HH:mm
    operating_hours__monday_close: boolean;         // close on monday or not
    operating_hours__tuesday_start: string;         // time format HH:mm
    operating_hours__tuesday_end: string;         // time format HH:mm
    operating_hours__tuesday_close: boolean;        // tuesday close or not
    operating_hours__wednesday_start: string;         // time format HH:mm
    operating_hours__wednesday_end: string;         // time format HH:mm
    operating_hours__wednesday_close: boolean;          // wednesday close or not
    operating_hours__thursday_start: string;         // time format HH:mm
    operating_hours__thursday_end: string;         // time format HH:mm
    operating_hours__thursday_close: boolean;           // thursday close or not
    operating_hours__friday_start: string;         // time format HH:mm
    operating_hours__friday_end: string;         // time format HH:mm
    operating_hours__friday_close: boolean;             // friday close or not
    operating_hours__saturday_start: string;         // time format HH:mm
    operating_hours__saturday_end: string;         // time format HH:mm
    operating_hours__saturday_close: boolean;           // saturday close or not
    operating_hours__sunday_start: string;         // time format HH:mm
    operating_hours__sunday_end: string;         // time format HH:mm
    operating_hours__sunday_close: boolean;         // sunday close or not

    // social media links
    facebook_url?: string;
    instagram_url?: string;
    twitter_url?: string;
    linkedIn_url?: string;
    youtube_url?: string;
    whatsapp_url?: string;
    tiktok_url?: string;
    google_business_url?: string;
    shop_google_rate_url?: string;

    company_description?: string;
    shop_logo: string;
    connected_account_id: string;

    coin_symbol: string;
    coin_label: string;
    coin_description: string;
    coin_correspondence_in_eur: number;
    coin_value: string;

    fee_percent: number;

    slug: string;

    constructor(props?: Company) {

        this.rec_id = props?.rec_id || null;
        this.business_name = props?.business_name || null;
        this.shop_name = props?.shop_name || null;
        this.tax_id = props?.tax_id || null;
        this.tax_authority = props?.tax_authority || null;
        this.contact_person__first_name = props?.contact_person__first_name || null;
        this.contact_person__last_name = props?.contact_person__last_name || null;
        this.contact_person__middle = props?.contact_person__middle || null;
        this.contact_email = props?.contact_email || null;
        this.contact_phone = props?.contact_phone || null;
        this.company_email = props?.company_email || null;
        this.company_phone = props?.company_phone || null;
        this.shop_url = props?.shop_url || null;
        this.shop_type = props?.shop_type || null;
        this.products_categories = props?.products_categories || null;

        // headquarters address
        this.headquarters_address__street = props?.headquarters_address__street || null;
        this.headquarters_address__city = props?.headquarters_address__city || null;
        this.headquarters_address__postal_code = props?.headquarters_address__postal_code || null;
        this.headquarters_address__state = props?.headquarters_address__state || null;
        this.headquarters_address__country = props?.headquarters_address__country || null;
        this.headquarters_longitude = props?.headquarters_longitude || null;
        this.headquarters_latitude = props?.headquarters_latitude || null;


        // operating hours
        this.operating_hours__monday_start = props?.operating_hours__monday_start || '00:00';
        this.operating_hours__monday_end = props?.operating_hours__monday_end || '00:00';
        this.operating_hours__monday_close = props?.operating_hours__monday_close || false;
        this.operating_hours__tuesday_start = props?.operating_hours__tuesday_start || '00:00';
        this.operating_hours__tuesday_end = props?.operating_hours__tuesday_end || '00:00';
        this.operating_hours__tuesday_close = props?.operating_hours__tuesday_close || false;
        this.operating_hours__wednesday_start = props?.operating_hours__wednesday_start || '00:00';
        this.operating_hours__wednesday_end = props?.operating_hours__wednesday_end || '00:00';
        this.operating_hours__wednesday_close = props?.operating_hours__wednesday_close || false;
        this.operating_hours__thursday_start = props?.operating_hours__thursday_start || '00:00';
        this.operating_hours__thursday_end = props?.operating_hours__thursday_end || '00:00';
        this.operating_hours__thursday_close = props?.operating_hours__thursday_close || false;
        this.operating_hours__friday_start = props?.operating_hours__friday_start || '00:00';
        this.operating_hours__friday_end = props?.operating_hours__friday_end || '00:00';
        this.operating_hours__friday_close = props?.operating_hours__friday_close || false;
        this.operating_hours__saturday_start = props?.operating_hours__saturday_start || '00:00';
        this.operating_hours__saturday_end = props?.operating_hours__saturday_end || '00:00';
        this.operating_hours__saturday_close = props?.operating_hours__saturday_close || true;
        this.operating_hours__sunday_start = props?.operating_hours__sunday_start || '00:00';
        this.operating_hours__sunday_end = props?.operating_hours__sunday_end || '00:00';
        this.operating_hours__sunday_close = props?.operating_hours__sunday_close || true;

        // social media links
        this.facebook_url = props?.facebook_url || null;
        this.instagram_url = props?.instagram_url || null;
        this.twitter_url = props?.twitter_url || null;
        this.linkedIn_url = props?.linkedIn_url || null;
        this.youtube_url = props?.youtube_url || null;
        this.whatsapp_url = props?.whatsapp_url || null;
        this.tiktok_url = props?.tiktok_url || null;
        this.google_business_url = props?.google_business_url || null;
        this.shop_google_rate_url = props?.shop_google_rate_url || null;

        this.company_description = props?.company_description || null;
        this.shop_logo = props?.shop_logo || null;
        this.connected_account_id = props?.connected_account_id || null;

        this.coin_symbol = props?.coin_symbol || null;
        this.coin_label = props?.coin_label || null;
        this.coin_description = props?.coin_description || null;
        this.coin_correspondence_in_eur = props?.coin_correspondence_in_eur || null;
        this.coin_value = props?.coin_value || null;

        this.fee_percent = props?.fee_percent || null;

        this.slug = props?.slug || null;

    }

}
