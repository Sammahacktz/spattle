import { Add as AddIcon } from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BattleGrid } from '../components/BattleGrid';
import { useAuth } from '../contexts/AuthContext';
import { battlesAPI } from '../services/api';
import { Battle, BattleCreate } from '../types';

const Battles: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const [battles, setBattles] = useState<Battle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [openCreate, setOpenCreate] = useState(false);
    const [formData, setFormData] = useState<BattleCreate>({
        title: '',
        description: '',
        creator_id: user?.id || 0,
    });
    const [openJoin, setOpenJoin] = useState(false);
    const [inviteCode, setInviteCode] = useState('');
    const [stravaSuccess, setStravaSuccess] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        if (user) {
            loadUserBattles(user.id);
        }
        // Check for #strava-success in the URL hash
        if (window.location.hash === '#strava-success') {
            setStravaSuccess(true);
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
    }, [user]);

    if (!isAuthenticated) {
        navigate("/login")
    }

    const loadUserBattles = async (userId: number) => {
        setIsLoading(true);
        try {
            // Fetch battles where the user is a member (participant or creator)
            const data = await battlesAPI.getByUser(userId);
            setBattles(data);
        } catch (err: any) {
            setError('Failed to load battles');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitCreate = async () => {
        if (!user) {
            setError('You must be logged in to create a battle.');
            return;
        }
        try {
            const newBattle = await battlesAPI.create({ ...formData, creator_id: user.id });
            setBattles([newBattle, ...battles]);
            setOpenCreate(false);
            setFormData({ title: '', description: '', creator_id: user.id });
        } catch (err: any) {
            setError('Failed to create battle');
        }
    };

    const handleSubmitJoin = async () => {
        try {
            const newBattle = await battlesAPI.join(inviteCode);
            setBattles([newBattle, ...battles]);
            setOpenJoin(false);
            setInviteCode("")
        } catch (err: any) {
            setError("Beitritt fehlgeschlagen");
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
            {stravaSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Strava wurde erfolgreich verbunden!
                </Alert>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <div>
                <div>
                    <h1>Deine Battles:</h1>
                    <Box display="flex" gap={2} mt={4} mb={5}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setOpenCreate(true)}
                            className='animated-button'
                            onMouseMove={e => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                                e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                            }}
                        >
                            Battle erstellen
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setOpenJoin(true)}
                            className='animated-button'
                            onMouseMove={e => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                                e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                            }}
                        >
                            Battle beitreten
                        </Button>
                    </Box>

                    <BattleGrid
                        battles={battles}
                        error={error}
                    />
                </div>
            </div>

            {/* Join Battle Dialog */}
            <Dialog open={openJoin} onClose={() => setOpenJoin(false)} maxWidth="sm" fullWidth slotProps={{ paper: { className: "spattle-card spattle-modal p-2" } }}
            >
                <DialogTitle>Battle beitreten</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="inviteCode"
                        label="Einladungscode"
                        fullWidth
                        variant="outlined"
                        value={inviteCode}
                        onChange={e => setInviteCode(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button className='animated-button' onClick={() => setOpenJoin(false)} onMouseMove={e => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                        e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                    }}>Abbrechen</Button>
                    <Button className='animated-button' onClick={handleSubmitJoin} variant="contained" onMouseMove={e => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                        e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                    }}>
                        Battle beitreten!
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Create Battle Dialog */}
            <Dialog
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                maxWidth="sm"
                fullWidth
                slotProps={{ paper: { className: "spattle-card spattle-modal p-2" } }}
            >
                <DialogTitle>Neues Battle erstellen</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="title"
                        label="Battle Name"
                        fullWidth
                        variant="outlined"
                        value={formData.title}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Beschreibung"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button className='animated-button' onClick={() => setOpenCreate(false)} onMouseMove={e => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                        e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                    }}>Abbrechen</Button>
                    <Button className='animated-button' onClick={handleSubmitCreate} variant="contained" onMouseMove={e => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                        e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                    }}>
                        Battle erstellen!
                    </Button>
                </DialogActions>
            </Dialog>
        </Container >
    );
};

export default Battles;
