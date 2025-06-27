import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Typography,
} from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Container maxWidth="lg" className='home-video'>
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h2" component="h1" gutterBottom>
                    Wilkommen bei Spattle
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
                    Die Ultimative Plattfrom um sich und seine Freunde zu motievieren und fit zu bleiben
                </Typography>
                <Typography variant="body1" sx={{ mt: 3, mb: 4 }}>
                    Trete den Challenges deiner Freunde bei oder erstelle deine eigenen und zeigt was Ihr drauf habt!
                </Typography>

                {!isAuthenticated && (
                    <Box sx={{ mt: 4 }}>
                        <Button
                            variant="contained"
                            size="large"
                            component={Link}
                            to="/register"
                            sx={{ mr: 2 }}
                        >
                            Loslegen!
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            component={Link}
                            to="/login"
                        >
                            Anmelden
                        </Button>
                    </Box>
                )}
            </Box>

            <Grid container spacing={4} sx={{ mt: 4 }}>
                <Grid >
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="h3" gutterBottom>
                                🏆 Compete
                            </Typography>
                            <Typography variant="body2">
                                Join battles in various sports and compete against other athletes.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Home;
