import React, { useState } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import RepositoryList from "./components/TableData";

import { Provider } from "react-redux";
import { store } from "./store/store";

export const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
  headers: {
    authorization: `Bearer ${process.env.REACT_APP_GH_TOKEN}`,
  },
  cache: new InMemoryCache(),
});

function App() {
  return (
    <Provider store={store}>
      <RepositoryList />
    </Provider>
  );
}

export default App;
