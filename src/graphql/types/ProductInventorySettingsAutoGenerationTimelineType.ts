import { GraphQlSearchProductsParamsArgs } from './../../models/Products';
import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, graphqlSync } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { mysql } from '../../lib/connectors/mysql';

import { ProductInventoriesSettingsAutoGenerationTimeline } from '../../models';

import { ProductInventoryProductType } from './ProductInventoryProductType';




// tslint:disable-next-line:variable-name
const ProductInventorySettingsAutoGenerationTimelineType = new GraphQLObjectType({
    name: 'ProductInventorySettingsAutoGenerationTimelineType',
    fields: () => ({


        setting_id: { type: GraphQLString },
        connected_account_id: { type: GraphQLString },
        type: { type: GraphQLString },
        value: { type: GraphQLString },
        setting_auto_generate_date__day: { type: GraphQLString },
        setting_auto_generate_date__month: { type: GraphQLString },
        setting_auto_generate_date_frequency: { type: GraphQLString },
        setting_auto_generate_date_frequency__day: { type: GraphQLString },
        setting_auto_generate_date_frequency__month: { type: GraphQLString }

    })
});

export { ProductInventorySettingsAutoGenerationTimelineType };
