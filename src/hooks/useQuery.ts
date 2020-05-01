import React from 'react';
import graphqlClient from '../graphqlClient';

interface State {
  loading: boolean;
  data: any;
  error?: any;
  fetchMore: (variables: any) => void;
}

export default function useQuery(query: string, variables?: any) {
  const fetchMore = ({ variables: newVariables, updateQuery }) => {
    runQuery({ ...variables, ...newVariables }, updateQuery);
  };

  const [state, setState] = React.useState<State>({
    loading: true,
    data: {},
    fetchMore,
  });

  const runQuery = async (variables, updateQuery?) => {
    try {
      setState((state) => ({ ...state, loading: true }));
      const response = await graphqlClient.request(query, variables);
      setState((state) => ({
        loading: false,
        data: updateQuery ? updateQuery(state.data, response) : response,
        fetchMore,
      }));
    } catch (error) {
      debugger;
      setState((state) => ({
        ...state,
        error,
        loading: false,
      }));
    }
  };

  React.useEffect(() => {
    runQuery(variables);
  }, [query, variables]);

  return state;
}
