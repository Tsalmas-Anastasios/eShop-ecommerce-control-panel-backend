import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';




// tslint:disable-next-line:variable-name
const ProductImagesType = new GraphQLObjectType({

    name: 'ProductImagesType',
    fields: () => ({

        id: { type: GraphQLString },
        url: { type: GraphQLString },
        main_image: { type: GraphQLBoolean },
        product_id: { type: GraphQLString },
        archived: { type: GraphQLBoolean },
        created_at: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },

    })

});


export { ProductImagesType };
