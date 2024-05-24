import { useState } from 'react';
import AllComments from './AllComments';
import type { FactType } from './Facts';
import type { CommentType } from './AllComments';

export default function CreateComment({ fact }: { fact: FactType }) {
  const [comments, setComments] = useState<CommentType[]>([]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const comment = formData.get('comment') as string;

    const INSERT_COMMENT_QUERY = `mutation createComment {
      insert_comments(objects: {username: "${username}", comment: "${comment}", fact_id: "${fact.id}"}) {
        returning {
          username
          comment
          id
          fact_id
        }
      }
    }
    `;

    fetch(import.meta.env.VITE_HASURA_PROJECT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': import.meta.env.VITE_HASURA_GRAPHQL_ADMIN_SECRET,
      },
      body: JSON.stringify({
        query: INSERT_COMMENT_QUERY,
      }),
    })
      .then((res) => res.json())
      .then((data) =>
        setComments([
          ...comments,
          { username, comment, id: data.data.insert_comments.returning[0].id },
        ])
      );

    e.currentTarget.reset();
  };

  return (
    <>
      <form onSubmit={submitHandler} className='flex flex-col gap-2 mt-5'>
        <p className='text-zinc-100 text-sm'>Submit a comment:</p>
        <input
          name='username'
          className='bg-slate-200 rounded-md p-1'
          type='text'
          placeholder='Username...'
        />
        <textarea
          name='comment'
          className='bg-slate-200 rounded-md p-1'
          placeholder='Comment...'
          cols={30}
          rows={1}></textarea>
        <button className='text-zinc-200 bg-zinc-500 transition-all self-center py-0.5 px-2 rounded-md hover:bg-zinc-400'>
          Submit
        </button>
      </form>
      <hr className='mt-5' />
      <AllComments fact={fact} comments={comments} setComments={setComments} />
    </>
  );
}
