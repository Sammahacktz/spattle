import { Box, Typography, Container } from '@mui/material';
import React from 'react';

const Contact = () => (
  <Container maxWidth="sm" sx={{ mt: 8 }}>
    <Box textAlign="center">
      <Typography variant="h3" gutterBottom>
        Kontakt
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Für Fragen und Probleme wenden Sie sich bitte an folgende E-Mail:
      </Typography>
      <Typography variant="body1">
        <a href="mailto:reichelt.stst@gmx.de">reichelt.stst@gmx.de</a>
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
        Website-Ersteller: Charlie-Luis Reichelt
      </Typography>
    </Box>
  </Container>
);

export default Contact;
