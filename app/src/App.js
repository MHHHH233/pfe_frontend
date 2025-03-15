
import logo from './logo.svg';
import './App.css';


import {BrowserRouter as Router} from 'react-router-dom';

import { Main } from './Main/Main';
import AdminDashboard from './Admin/Admin';






const App =()=>{
  return (

   <Router>
        <Main/>
        
   </Router>
   )
}   
export default App;
