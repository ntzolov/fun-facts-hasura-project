import { useEffect, useState } from 'react';

type FactType = {
  title: string;
  description: string;
  id: string;
};

const GET_FACTS_QUERY = `
    query MyQuery {
      facts {
        description
        title
        id
      }
    }
  `;

export default function Facts() {
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(facts);
  }, [facts]);

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
  }, []);

  if (loading) {
    return <p className='text-3xl text-neutral-200'>Loading...</p>;
  }

  return facts ? (
    facts.map((fact: FactType) => <div key={fact.id}>{fact.title}</div>)
  ) : (
    <p>No facts uploaded!</p>
  );
}
