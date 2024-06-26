import { useEffect, useState } from 'react';
import Fact from './Fact';

export type FactType = {
  title: string;
  description: string;
  id: string;
};

export type FactFunctionType = (facts: FactType[]) => void | FactType[];

const GET_FACTS_QUERY = `
    query MyQuery {
      facts {
        description
        title
        id
      }
    }
  `;

export default function Facts({
  facts,
  setFacts,
  user,
}: {
  facts: FactType[];
  setFacts: FactFunctionType;
  user: string;
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(import.meta.env.VITE_HASURA_PROJECT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': import.meta.env.VITE_HASURA_GRAPHQL_ADMIN_SECRET,
      },
      body: JSON.stringify({
        query: GET_FACTS_QUERY,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setFacts(data.data.facts);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <p className='text-3xl text-neutral-200'>Loading...</p>;
  }

  return facts.length > 0 ? (
    facts.map((fact: FactType) => (
      <Fact key={fact.id} fact={fact} facts={facts} setFacts={setFacts} user={user} />
    ))
  ) : (
    <p>No facts uploaded!</p>
  );
}
