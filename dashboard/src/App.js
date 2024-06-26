import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Logout from './pages/logout';
import Register from './pages/register';
import Users from './pages/users';
import Data from './pages/data';
import LiveData from './pages/live-data';
import Employees from './pages/employees';
import Automobiles from './pages/automobiles';
import AddAutomobile from './pages/add-automibile';
import AddEmployee from './pages/add-employee';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (nuser) => {
    setUser(nuser);
    localStorage.setItem(
      'underground-mining-tracking-system-user',
      JSON.stringify(nuser)
    );
  };
  const handleLougout = () => {
    setUser(null);
    localStorage.removeItem('underground-mining-tracking-system-user');
  };

  useEffect(() => {
    if (localStorage.getItem('underground-mining-tracking-system-user'))
      setUser(
        JSON.parse(
          localStorage.getItem('underground-mining-tracking-system-user')
        )
      );
    else setUser(null);
  }, []);

  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home user={user} />} />
          <Route
            path='/login'
            element={<Login handler={handleLogin} user={user} />}
          />
          <Route
            path='/logout'
            element={<Logout user={user} handler={handleLougout} />}
          />
          <Route
            path='/register'
            element={<Register user={user} handler={handleLougout} />}
          />
          <Route path='/data' element={<Data user={user} />} />
          <Route path='/live-data' element={<LiveData user={user} />} />
          <Route path='/users' element={<Users user={user} />} />
          <Route path='/employees' element={<Employees user={user} />} />
          <Route path='/automobiles' element={<Automobiles user={user} />} />
          <Route
            path='/automobiles/add'
            element={<AddAutomobile user={user} />}
          />
          <Route path='/employees/add' element={<AddEmployee user={user} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
