import { useEffect } from 'react';
import type { FactType } from './Facts';

export type CommentType = {
  username: string;
  comment: string;
  id: string;
};

export type CommentFunctionType = (facts: CommentType[]) => void | CommentType[];

export default function AllComments({
  fact,
  comments,
  setComments,
}: {
  fact: FactType;
  comments: CommentType[];
  setComments: CommentFunctionType;
}) {
  const GET_COMMENTS_QUERY = `query getComments {
    comments(where: {fact_id: {_eq: "${fact.id}"}}) {
      username
      comment
      id
    }
  }`;

  useEffect(() => {
    fetch(import.meta.env.VITE_HASURA_PROJECT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': import.meta.env.VITE_HASURA_GRAPHQL_ADMIN_SECRET,
      },
      body: JSON.stringify({
        query: GET_COMMENTS_QUERY,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setComments(data.data.comments);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='flex flex-col mt-5 text-zinc-200'>
      <p className='text-sm'>All comments:</p>
      {comments.length > 0 ? (
        comments.map((comment: CommentType) => (
          <div key={comment.id} className='bg-gray-600 p-2 rounded-md mt-2'>
            <p className='text-sm font-semibold'>{comment.username}</p>
            <p className='text-xs'>{comment.comment}</p>
          </div>
        ))
      ) : (
        <p>No comments yet!</p>
      )}
    </div>
  );
}
