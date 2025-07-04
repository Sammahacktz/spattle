import { Container } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import Battles from './pages/Battles';
import Home from './pages/Home';
import Login from './pages/Login';
import Party from './pages/Party';
import Register from './pages/Register';
import './styles/global.scss';



function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/battles" element={<Battles />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/battle/party/:partycode" element={<Party />} />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
