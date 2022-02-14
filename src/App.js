import { useState, useEffect } from 'react';
import { getDataModel } from './DataModel';

function App() {
  const dataModel = getDataModel();
  const [restaurants, setRestaurants] = useState([]);
  useEffect(()=>{ 
    const listenerId = dataModel.addListener(() => {
      let newRestaurants = Array.from(dataModel.restaurants);
      setRestaurants(newRestaurants);
    });
    return(() => {
      dataModel.removeListener(listenerId);
    });
  }, []);
  return (
    <div className="App">
      <ul>
        {restaurants.map(r => <li key={r.key}>{r.name}</li>)}
      </ul>
    </div>
  );
}

export default App;
