import { createApi } from "@reduxjs/toolkit/query/react";
import { gql } from "@apollo/client";
import { client } from "../App";

const SEARCH_REPOSITORIES = gql`
  query SearchRepositoriesName(
    $queryString: String!
    $first: Int!
    $after: String
  ) {
    search(
      query: $queryString
      type: REPOSITORY
      first: $first
      after: $after
    ) {
      edges {
        node {
          ... on Repository {
            id
            name
            forkCount
            stargazerCount
            primaryLanguage {
              name
            }
            updatedAt
            description
            licenseInfo {
              name
            }
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: async ({ document, variables }) => {
    const result = await client.query({
      query: document,
      variables,
    });
    return { data: result.data };
  },
  endpoints: (builder) => ({
    searchRepositories: builder.query({
      query: ({ queryString, sort, first = 10, after }) => {
        const queryWithSort = `${queryString} sort:${sort}`;
        return {
          document: SEARCH_REPOSITORIES,
          variables: { queryString: queryWithSort, first, after },
        };
      },
    }),
  }),
});


export const { useSearchRepositoriesQuery } = apiSlice;
