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
import Contact from './pages/Contact';
import Impressum from './pages/Impressum';
import DataProtect from './pages/DataProtect';
import './styles/global.scss';
import Footer from './components/Footer';



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
            <Route path="/contact" element={<Contact />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/dataprotection" element={<DataProtect />} />
          </Routes>
        </Container>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
