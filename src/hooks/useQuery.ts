import React from 'react';
import graphqlClient from '../graphqlClient';

interface Data {
  loading: boolean;
  data: any;
  error?: any;
}

export default function useQuery(query: string, variables?: any) {
  const [data, setData] = React.useState<Data>({ loading: true, data: {} });

  React.useEffect(() => {
    async function runQuery() {
      try {
        setData({ ...data, loading: true });
        const response = await graphqlClient.request(query, variables);
        setData({ loading: false, data: response });
      } catch (error) {
        setData({ error, loading: false, data: {} });
      }
    }

    runQuery();
  }, [query, variables]);

  return data;
}
