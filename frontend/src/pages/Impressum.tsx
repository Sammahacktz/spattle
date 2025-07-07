import { Box, Typography, Container } from '@mui/material';
import React from 'react';

const Impressum = () => (
  <Container maxWidth="sm" sx={{ mt: 8 }}>
    <Box textAlign="center">
      <Typography variant="h3" gutterBottom>
        Impressum
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Angaben gemäß § 5 TMG
      </Typography>
      <Typography variant="body1">
        Charlie-Luis Reichelt<br />
        Poisentalstraße 101<br />
        01705 Freital<br />
        Deutschland
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Kontakt: <a href="mailto:reichelt.stst@gmx.de">reichelt.stst@gmx.de</a>
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
        Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV: Charlie-Luis Reichelt
      </Typography>
    </Box>
  </Container>
);

export default Impressum;
