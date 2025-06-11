import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { Main } from './Main/Main';
import AdminDashboard from './Admin/Admin';
import { LoadingProvider } from './contexts/LoadingContext';
import GlobalLoader from './Component/GlobalLoader';
import ScrollToTop from './components/ScrollToTop';

const App = () => {
  return (
    <LoadingProvider>
      <Router>
        <ScrollToTop />
        <GlobalLoader />
        <Main />
      </Router>
    </LoadingProvider>
  );
}

export default App;
