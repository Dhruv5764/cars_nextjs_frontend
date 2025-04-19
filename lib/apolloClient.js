// lib/apolloClient.ts

import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';

// Create an Apollo Link to include JWT token in the header
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('jwt'); // Retrieve JWT token from localStorage
  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : '', // Include JWT token in the Authorization header
    },
  });
  return forward(operation);
});

// Create the Apollo Client
const client = new ApolloClient({
  link: authLink.concat(new HttpLink({ uri: 'http://localhost:1337/graphql' })), // Your GraphQL API URL
  cache: new InMemoryCache(),
});

export default client;
