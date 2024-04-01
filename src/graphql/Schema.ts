import { GraphQLSchema } from 'graphql';
import { QueryType } from './Query';

const schema = new GraphQLSchema({
    query: QueryType
});

export { schema };
