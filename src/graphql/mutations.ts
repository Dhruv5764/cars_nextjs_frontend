import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation login($identifier: String!, $password: String!) {
    login(input: { identifier: $identifier, password: $password }) {
      jwt
      user {
        id
        username
        email
        
      }
    }
  }
`;


export const GET_CARS_QUERY = gql`
  query GetCars($start: Int!, $limit: Int!) {
    cars(pagination: { start: $start, limit: $limit }) {
      name
      description
      price
      specifications
      image {
        url
      }
      ratings {
        rating
      }
    }
  }
`;


