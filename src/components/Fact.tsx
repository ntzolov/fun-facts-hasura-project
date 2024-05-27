import { useEffect, useState } from 'react';
import CreateComment from './CreateComment';
import type { FactType } from './Facts';
import type { FactFunctionType } from './Facts';

export default function Fact({
  fact,
  facts,
  setFacts,
  user,
}: {
  fact: FactType;
  facts: FactType[];
  setFacts: FactFunctionType;
  user: string;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [password, setPassword] = useState<string>('');
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(0);

  const INSERT_LIKE_QUERY = `mutation MyMutation {
    insert_likes(objects: {user_id: "${user}", fact_id: "${fact.id}"}) {
      returning {
        fact_id
        user_id
      }
    }
  }
  `;

  const IS_LIKED_QUERY = `query MyQuery {
    likes(where: {fact_id: {_eq: "${fact.id}"}, user_id: {_eq: "${user}"}}) {
      fact_id
      user_id
      created_at
      updated_at
    }
  }
  `;

  const ALL_LIKES_QUERY = `query MyQuery {
    likes(where: {fact_id: {_eq: "${fact.id}"}}) {
      fact_id
      user_id
    }
  }
  
  `;

  useEffect(() => {
    fetch(import.meta.env.VITE_HASURA_PROJECT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': import.meta.env.VITE_HASURA_GRAPHQL_ADMIN_SECRET,
      },
      body: JSON.stringify({
        query: IS_LIKED_QUERY,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data.likes.length > 0) {
          setIsLiked(true);
        }
      });

    fetch(import.meta.env.VITE_HASURA_PROJECT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': import.meta.env.VITE_HASURA_GRAPHQL_ADMIN_SECRET,
      },
      body: JSON.stringify({
        query: ALL_LIKES_QUERY,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLikes(data.data.likes.length);
      });

    setLoading(false);
  }, [IS_LIKED_QUERY, ALL_LIKES_QUERY]);

  const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    console.log(loading);
  }, [loading]);

  async function likeHandler() {
    fetch(import.meta.env.VITE_HASURA_PROJECT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': import.meta.env.VITE_HASURA_GRAPHQL_ADMIN_SECRET,
      },
      body: JSON.stringify({
        query: INSERT_LIKE_QUERY,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setLikes(likes + 1);
        setIsLiked(true);
        return data;
      });
  }

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

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className='flex space-x-3'>
          <p>Likes: {likes}</p>
          {!isLiked ? (
            <button type='button' onClick={likeHandler}>
              like
            </button>
          ) : (
            <p>Already liked!</p>
          )}
        </div>
      )}

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
