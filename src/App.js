import "./styles/App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Reset from "./Reset";
import Dashboard from "./Dashboard";

function App() {
  document.title = 'MeatFreed Dashboard'
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login/>} />
          <Route exact path="/register" element={<Register/>} />
          <Route exact path="/reset" element={<Reset/>} />
          <Route exact path="/dashboard" element={<Dashboard/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

/* function App() {
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
} */
