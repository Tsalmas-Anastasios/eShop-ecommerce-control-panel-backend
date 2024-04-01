import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';





// tslint:disable-next-line:variable-name
const ProductSpecificationFieldType = new GraphQLObjectType({

    name: 'ProductSpecificationFieldType',
    fields: () => ({

        id: { type: GraphQLString },
        specification_field_name: { type: GraphQLString },
        specification_field_value: { type: GraphQLString },
        specification_category_id: { type: GraphQLString },
        product_id: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },

    })

});

export { ProductSpecificationFieldType };
