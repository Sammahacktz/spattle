import { Box, Container, Link as MuiLink, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <Box component="footer" sx={{ bgcolor: 'background.paper', py: 3, mt: 8 }}>
    <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
      <MuiLink component={Link} to="/impressum" underline="hover" color="inherit">
        Impressum
      </MuiLink>
      <MuiLink component={Link} to="/dataprotection" underline="hover" color="inherit">
        Datenschutzerklärung
      </MuiLink>
      <MuiLink component={Link} to="/contact" underline="hover" color="inherit">
        Kontakt
      </MuiLink>
    </Container>
    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
      © {new Date().getFullYear()} Spattle
    </Typography>
  </Box>
);

export default Footer;
