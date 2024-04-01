import { Contact, ContactLabel, ContactAddressData, ContactCustomFields, ContactPhoneData, ContactEmailData } from '../../models';
import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';




// tslint:disable-next-line:variable-name
const ContactAddressType = new GraphQLObjectType({

    name: 'ContactAddressType',
    fields: () => ({

        rec_id: { type: GraphQLString },
        country: { type: GraphQLString },
        address: { type: GraphQLString },
        address_line_2: { type: GraphQLString },
        city: { type: GraphQLString },
        postal_code: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },
        contact_id: { type: GraphQLString },

    })

});


export { ContactAddressType };
