import { useState } from 'react';
import CreateComment from './CreateComment';
import type { FactType } from './Facts';
import type { FactFunctionType } from './Facts';

export default function Fact({
  fact,
  facts,
  setFacts,
}: {
  fact: FactType;
  facts: FactType[];
  setFacts: FactFunctionType;
}) {
  const [password, setPassword] = useState('');

  const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  async function deleteFact() {
    const DELETE_FACT_QUERY = `mutation MyMutation {
      delete_facts_by_pk(id: "${fact.id}") {
        id
      }
    }`;

    fetch(import.meta.env.VITE_HASURA_PROJECT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': import.meta.env.VITE_HASURA_GRAPHQL_ADMIN_SECRET,
      },
      body: JSON.stringify({
        query: DELETE_FACT_QUERY,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const newFacts = facts.filter((f) => f.id !== fact.id);
        setFacts(newFacts);
        return data;
      });
  }

  return (
    <div className='h-80 overflow-auto p-5 mx-2 flex flex-col bg-gray-700 rounded-md max-w-96'>
      <h1 className='text-amber-100 text-2xl'>{fact.title}</h1>
      <p className='text-lg text-amber-50 pt-5'>{fact.description}</p>
      <hr className='mt-2' />

      <CreateComment fact={fact} />

      <div className='flex justify-center gap-3 mt-5'>
        <input
          className='rounded-md bg-slate-200 px-1 w-36'
          onChange={passwordHandler}
          value={password}
          type='text'
          placeholder='Delete password...'
        />
        {password === import.meta.env.VITE_ADMIN_PASSWORD && (
          <button
            className='bg-red-400 hover:bg-red-300 transition-all text-sm font-semibold self-center py-1 px-2 rounded-md'
            onClick={deleteFact}>
            DELETE
          </button>
        )}
      </div>
    </div>
  );
}
