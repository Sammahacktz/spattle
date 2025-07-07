import { Box, Typography, Container } from '@mui/material';
import React from 'react';

const DataProtect = () => (
  <Container maxWidth="sm" sx={{ mt: 8 }}>
    <Box textAlign="center">
      <Typography variant="h3" gutterBottom>
        Datenschutzerklärung
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Personenbezogene Daten werden auf dieser Webseite nur im technisch notwendigen Umfang erhoben und niemals verkauft oder an Dritte weitergegeben.
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Wir nutzen keine Cookies.
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Verantwortlich für die Datenverarbeitung:
      </Typography>
      <Typography variant="body1">
        Charlie-Luis Reichelt<br />
        Poisentalstraße 101<br />
        01705 Freital<br />
        Deutschland<br />
        E-Mail: <a href="mailto:reichelt.stst@gmx.de">reichelt.stst@gmx.de</a>
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
        Weitere Informationen zum Datenschutz finden Sie auf Anfrage per E-Mail.
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
        Hinweis: Bei Nutzung der Strava-Integration beachten Sie bitte die <a href="https://www.strava.com/legal/privacy" target="_blank" rel="noopener noreferrer">Datenschutzhinweise von Strava</a>.
      </Typography>
      <Typography variant="body2" color="error" sx={{ mt: 4, fontWeight: 'bold' }}>
        Hinweis: Diese Website befindet sich noch im Aufbau.
      </Typography>
    </Box>
  </Container>
);

export default DataProtect;
