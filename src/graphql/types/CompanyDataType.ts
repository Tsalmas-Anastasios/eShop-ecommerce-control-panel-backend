import { GraphQlSearchProductsParamsArgs } from './../../models/Products';
import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, graphqlSync } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';






// tslint:disable-next-line:variable-name
const CompanyDataType = new GraphQLObjectType({
    name: 'CompanyDataType',
    fields: () => ({

        rec_id: { type: GraphQLString },
        business_name: { type: GraphQLString },
        shop_name: { type: GraphQLString },
        tax_id: { type: GraphQLString },
        tax_authority: { type: GraphQLString },
        contact_person__first_name: { type: GraphQLString },
        contact_person__last_name: { type: GraphQLString },
        contact_person__middle_name: { type: GraphQLString },
        contact_email: { type: GraphQLString },
        contact_phone: { type: GraphQLString },
        company_email: { type: GraphQLString },
        company_phone: { type: GraphQLString },
        shop_url: { type: GraphQLString },
        shop_type: { type: GraphQLString },
        products_categories: { type: GraphQLString },
        headquarters_address__street: { type: GraphQLString },
        headquarters_address__city: { type: GraphQLString },
        headquarters_address__postal_code: { type: GraphQLString },
        headquarters_address__state: { type: GraphQLString },
        headquarters_address__country: { type: GraphQLString },
        headquarters_longitude: { type: GraphQLFloat },
        headquarters_latitude: { type: GraphQLFloat },
        operating_hours__monday_start: { type: GraphQLString },
        operating_hours__monday_end: { type: GraphQLString },
        operating_hours__monday_close: { type: GraphQLBoolean },
        operating_hours__tuesday_start: { type: GraphQLString },
        operating_hours__tuesday_end: { type: GraphQLString },
        operating_hours__tuesday_close: { type: GraphQLBoolean },
        operating_hours__wednesday_start: { type: GraphQLString },
        operating_hours__wednesday_end: { type: GraphQLString },
        operating_hours__wednesday_close: { type: GraphQLBoolean },
        operating_hours__thursday_start: { type: GraphQLString },
        operating_hours__thursday_end: { type: GraphQLString },
        operating_hours__thursday_close: { type: GraphQLBoolean },
        operating_hours__friday_start: { type: GraphQLString },
        operating_hours__friday_end: { type: GraphQLString },
        operating_hours__friday_close: { type: GraphQLBoolean },
        operating_hours__saturday_start: { type: GraphQLString },
        operating_hours__saturday_end: { type: GraphQLString },
        operating_hours__saturday_close: { type: GraphQLBoolean },
        operating_hours__sunday_start: { type: GraphQLString },
        operating_hours__sunday_end: { type: GraphQLString },
        operating_hours__sunday_close: { type: GraphQLBoolean },
        facebook_url: { type: GraphQLString },
        instagram_url: { type: GraphQLString },
        twitter_url: { type: GraphQLString },
        linkedin_url: { type: GraphQLString },
        youtube_url: { type: GraphQLString },
        whatsapp_url: { type: GraphQLString },
        tiktok_url: { type: GraphQLString },
        google_business_url: { type: GraphQLString },
        shop_google_rate_url: { type: GraphQLString },
        company_description: { type: GraphQLString },
        shop_logo: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },

        coin_symbol: { type: GraphQLString },
        coin_label: { type: GraphQLString },
        coin_description: { type: GraphQLString },
        coin_correspondence_in_eur: { type: GraphQLFloat },
        coin_value: { type: GraphQLString },

        fee_percent: { type: GraphQLFloat },

        slug: { type: GraphQLString },

    })
});

export { CompanyDataType };
