import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';
import { ProductCategory } from '../../models';




// tslint:disable-next-line:variable-name
const ProductCategoryType = new GraphQLObjectType({

    name: 'ProductCategoryType',
    fields: () => ({

        pcategory_id: { type: GraphQLString },
        label: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },

    })

});


export { ProductCategoryType };
