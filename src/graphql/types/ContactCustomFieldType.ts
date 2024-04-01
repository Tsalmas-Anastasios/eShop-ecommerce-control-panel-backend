import { Contact, ContactLabel, ContactAddressData, ContactCustomFields, ContactPhoneData, ContactEmailData } from '../../models';
import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';




// tslint:disable-next-line:variable-name
const ContactCustomFieldType = new GraphQLObjectType({

    name: 'ContactCustomFieldType',
    fields: () => ({

        rec_id: { type: GraphQLString },
        label: { type: GraphQLString },
        value: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },
        contact_id: { type: GraphQLString }

    })

});


export { ContactCustomFieldType };
