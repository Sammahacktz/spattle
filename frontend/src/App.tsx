import { Container } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import BackgroundContext from './components/BackgroundContext';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import Battles from './pages/Battles';
import Contact from './pages/Contact';
import DataProtect from './pages/DataProtect';
import Home from './pages/Home';
import Impressum from './pages/Impressum';
import Login from './pages/Login';
import Party from './pages/Party';
import Register from './pages/Register';
import './styles/global.scss';


function App() {
  return (
    <AuthProvider>
      <Router>
        <BackgroundContext>
          <Navbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4, minHeight: "100vh" }}>
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
        </BackgroundContext>
      </Router>
    </AuthProvider>
  );
}

export default App;
