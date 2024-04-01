import { Order, OrderProductIdentifiers, OrderProductDetails } from '../../models';
import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';





// tslint:disable-next-line:variable-name
const OrderPaymentMethodType = new GraphQLObjectType({

    name: 'OrderPaymentMethodType',
    fields: () => ({

        rec_id: { type: GraphQLString },
        label: { type: GraphQLString },
        description: { type: GraphQLString },
        service: { type: GraphQLString },
        active: { type: GraphQLString },
        archived: { type: GraphQLString }

    })

});


export { OrderPaymentMethodType };
