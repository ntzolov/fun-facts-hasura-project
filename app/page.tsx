'use client';
import { useState } from 'react';

export default function Home() {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ title, description });
  };

  return (
    <div className='min-h-screen w-screen bg-gray-600'>
      <main className='flex flex-col items-center  p-5'>
        <form className='flex flex-col items-center gap-3 min-w-80' onSubmit={handleSubmit}>
          <p className='text-2xl font-bold text-teal-400'>Create fact</p>
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
          <button className='px-4 py-2 bg-green-400 rounded-md hover:bg-green-500 transition'>
            CREATE
          </button>
        </form>
      </main>
    </div>
  );
}
