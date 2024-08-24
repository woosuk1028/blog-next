import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: 'https://seok2.duckdns.org/graphql',
    cache: new InMemoryCache(),
});

export default client;