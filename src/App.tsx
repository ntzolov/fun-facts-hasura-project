import CreateFact from './components/CreateFact';
import Facts from './components/Facts';

function App() {
  return (
    <div className='flex flex-col items-center bg-gray-800 w-screen h-screen'>
      <CreateFact />
      <Facts />
    </div>
  );
}

export default App;
