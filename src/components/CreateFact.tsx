// import { gql } from '@apollo/client';

import { useState } from 'react';
import Facts from './Facts';
import type { FactType } from './Facts';

export default function CreateFact() {
  const [facts, setFacts] = useState<FactType[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  const INSERT_FACT_QUERY = `mutation MyMutation {
    insert_facts(objects: [{ title: "${title}", description: "${description}"}]) {
      returning {
        title
        description
        id
      }
    }
  }`;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    fetch(import.meta.env.VITE_HASURA_PROJECT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': import.meta.env.VITE_HASURA_GRAPHQL_ADMIN_SECRET,
      },
      body: JSON.stringify({
        query: INSERT_FACT_QUERY,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTitle('');
        setDescription('');
        setFacts([...facts, { title, description, id: data.data.insert_facts.returning[0].id }]);
        setLoading(false);
      });
  };

  return (
    <>
      <div className='py-5'>
        <form className='flex flex-col items-center gap-3 min-w-80' onSubmit={handleSubmit}>
          <p className='text-2xl font-bold text-green-300'>Create fact</p>
          <input
            value={title}
            onChange={handleTitleChange}
            type='text'
            placeholder='Title...'
            className='p-2 rounded-md w-full'
          />
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder='Description...'
            className='p-2 rounded-md h-40 w-full'></textarea>
          <button
            disabled={loading}
            className='px-4 py-2 bg-green-400 rounded-sm hover:bg-green-300 transition disabled:filter disabled:grayscale'>
            {loading ? 'Loading...' : 'CREATE'}
          </button>
        </form>
      </div>
      <div className='pt-3 flex flex-wrap justify-center gap-10 mb-5'>
        <Facts facts={facts} setFacts={setFacts} />
      </div>
    </>
  );
}
