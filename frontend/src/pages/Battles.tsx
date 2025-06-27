import { Add as AddIcon } from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { battlesAPI } from '../services/api';
import { Battle, BattleCreate } from '../types';

const Battles: React.FC = () => {
    const [battles, setBattles] = useState<Battle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<BattleCreate>({
        title: '',
        description: '',
        sport_type: '',
    });
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        loadBattles();
    }, []);

    const loadBattles = async () => {
        try {
            const data = await battlesAPI.getAll();
            setBattles(data);
        } catch (err: any) {
            setError('Failed to load battles');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            const newBattle = await battlesAPI.create(formData);
            setBattles([newBattle, ...battles]);
            setOpen(false);
            setFormData({ title: '', description: '', sport_type: '' });
        } catch (err: any) {
            setError('Failed to create battle');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    if (isLoading) {
        return (
            <Container>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Sport Battles
                </Typography>
                {isAuthenticated && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpen(true)}
                    >
                        Create Battle
                    </Button>
                )}
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                {battles.map((battle) => (
                    <Grid item xs={12} sm={6} md={4} key={battle.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" component="h3" gutterBottom>
                                    {battle.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {battle.description || 'No description available'}
                                </Typography>
                                <Chip
                                    label={battle.sport_type}
                                    color="primary"
                                    size="small"
                                    sx={{ mb: 1 }}
                                />
                                <Typography variant="caption" display="block" color="text.secondary">
                                    Created: {new Date(battle.created_at).toLocaleDateString()}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary">
                                    View Details
                                </Button>
                                {isAuthenticated && (
                                    <Button size="small" color="secondary">
                                        Join Battle
                                    </Button>
                                )}
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {battles.length === 0 && !error && (
                <Box textAlign="center" py={8}>
                    <Typography variant="h6" color="text.secondary">
                        No battles available yet.
                    </Typography>
                    {isAuthenticated && (
                        <Typography variant="body2" color="text.secondary">
                            Be the first to create one!
                        </Typography>
                    )}
                </Box>
            )}

            {/* Create Battle Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Battle</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="title"
                        label="Battle Title"
                        fullWidth
                        variant="outlined"
                        value={formData.title}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="sport_type"
                        label="Sport Type"
                        fullWidth
                        variant="outlined"
                        value={formData.sport_type}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        Create Battle
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Battles;
