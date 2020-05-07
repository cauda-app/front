import React from 'react';
import graphqlClient from '../graphqlClient';

interface State {
  loading: boolean;
  data: any;
  error?: any;
  fetchMore: (variables: any) => void;
}

interface Options {
  variables?: any;
  pollInterval?: number;
}

export default function useQuery(query: string, options: Options = {}) {
  const fetchMore = ({ variables: newVariables, updateQuery }) => {
    runQuery({ ...options.variables, ...newVariables }, updateQuery);
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
      setState((state) => ({
        ...state,
        error,
        loading: false,
      }));
    }
  };

  React.useEffect(() => {
    runQuery(options.variables);

    const interval = setInterval(() => {
      runQuery(options.variables);
    }, options.pollInterval);

    return () => clearInterval(interval);
  }, [query, options.variables, options.pollInterval]);

  React.useEffect(() => {
    runQuery(options.variables);
  }, [query, options.variables]);

  return state;
}
