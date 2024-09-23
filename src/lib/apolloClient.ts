import { ApolloClient, InMemoryCache } from '@apollo/client';
import { DEFAULT_URL, DEFAULT_API_URL } from '@/lib/constants';

const client = new ApolloClient({
    uri: DEFAULT_API_URL,
    cache: new InMemoryCache(),
});

export default client;