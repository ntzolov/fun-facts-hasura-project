import type { FactType } from './Facts';
import type { FactFuctionType } from './Facts';

export default function Fact({ fact, setFacts }: { fact: FactType; setFacts: FactFuctionType }) {
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
        setFacts((prevFacts: any) => prevFacts.filter((f) => f.id !== fact.id));
      });
  }

  return (
    <div className='self-start max-h-96 overflow-auto m-10 p-5 flex flex-col justify-center bg-gray-700 rounded-md max-w-96'>
      <h1 className='text-amber-100 text-2xl'>{fact.title}</h1>
      <p className='text-lg text-amber-50 pt-5'>{fact.description}</p>
      <button
        className='bg-red-400 hover:bg-red-300 transition-all mt-10 self-center py-1 px-2 rounded-sm'
        onClick={deleteFact}>
        DELETE
      </button>
    </div>
  );
}
