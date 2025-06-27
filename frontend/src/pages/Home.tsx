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
        <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h2" component="h1" gutterBottom>
                    Welcome to Spattle
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
                    The Ultimate Sport Battle Platform
                </Typography>
                <Typography variant="body1" sx={{ mt: 3, mb: 4 }}>
                    Join exciting sport battles, compete with others, and showcase your skills!
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
                            Get Started
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            component={Link}
                            to="/login"
                        >
                            Sign In
                        </Button>
                    </Box>
                )}
            </Box>

            <Grid container spacing={4} sx={{ mt: 4 }}>
                <Grid item xs={12} md={4}>
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
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="h3" gutterBottom>
                                📊 Track Progress
                            </Typography>
                            <Typography variant="body2">
                                Monitor your performance and see how you rank against others.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="h3" gutterBottom>
                                🌟 Showcase Skills
                            </Typography>
                            <Typography variant="body2">
                                Display your athletic abilities and build your reputation.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Home;
