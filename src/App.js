import "./styles/App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import LoginRegister from "./LoginRegister";
import LoginAdmin from "./LoginAdmin";
import Account from "./Account";
import UserOverview from "./UserOverview";
import AccountDetail from "./AccountDetail";
import Reset from "./Reset";
import Dashboard from "./Dashboard";
import DashboardCharts from "./DashboardCharts";
import Admin from "./Admin";
import Details from "./Details";
import Overview from "./Overview";

function App() {
  document.title = 'MeatFreed Dashboard'
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login/>} />
          <Route exact path="/loginRegister" element={<LoginRegister/>} />
          <Route exact path="/loginAdmin" element={<LoginAdmin/>} />
          <Route exact path="/account" element={<Account/>} />
          <Route exact path="/userOverview" element={<UserOverview/>} />
          <Route exact path="/accountDetail" element={<AccountDetail/>} />
          <Route exact path="/reset" element={<Reset/>} />
          <Route exact path="/dashboard" element={<Dashboard/>} />
          <Route exact path="/dashboardCharts" element={<DashboardCharts/>} />
          <Route exact path="/admin" element={<Admin/>} />
          <Route exact path="/details" element={<Details/>} />
          <Route exact path="/overview" element={<Overview/>} />
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
