import {
    Alert,
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usersAPI } from '../services/api';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwörter stimmen nicht überein!');
            return;
        }
        if (formData.password.length < 8) {
            setError('Das Passwort muss mindestens 8 Zeichen lang sein!');
            return;
        }
        if (!/[A-Z]/.test(formData.password)) {
            setError('Das Passwort muss mindestens einen Großbuchstaben enthalten!');
            return;
        }
        if (!/[a-z]/.test(formData.password)) {
            setError('Das Passwort muss mindestens einen Kleinbuchstaben enthalten!');
            return;
        }
        if (!/[0-9]/.test(formData.password)) {
            setError('Das Passwort muss mindestens eine Zahl enthalten!');
            return;
        }
        if (!/[^A-Za-z0-9]/.test(formData.password)) {
            setError('Das Passwort muss mindestens ein Sonderzeichen enthalten!');
            return;
        }

        setIsLoading(true);

        try {
            await usersAPI.create({
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Regestrierung fehlgeschlagen');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
                    <Typography component="h1" variant="h4" align="center" gutterBottom>
                        Regestrieren
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Nutzername"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={formData.username}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Addresse"
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Passwort"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Account wird erstellt ...' : 'Regestrieren'}
                        </Button>
                        <Box textAlign="center">
                            <Link to="/login">
                                Du hast schon einen Account? Anmelden
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Register;
