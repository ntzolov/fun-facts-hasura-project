import { useEffect, useState } from 'react';
import CreateFact from './components/CreateFact';

function App() {
  const [user, setUser] = useState('');

  useEffect(() => {
    fetch('https://api.ipify.org/?format=json')
      .then((res) => res.json())
      .then((data) => setUser(data.ip));
  }, []);

  return (
    <div className='flex flex-col items-center bg-gray-800'>
      <CreateFact user={user} />
    </div>
  );
}

export default App;
