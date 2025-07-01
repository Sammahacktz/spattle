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
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
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

    useEffect(() => {
        if (user) {
            loadUserBattles(user.id);
        }
    }, [user]);

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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Deine Battles
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <div>
                <div>
                    <h2>Deine Battles:</h2>
                    {isAuthenticated && (
                        <>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setOpenCreate(true)}
                            >
                                Battle erstellen
                            </Button>
                        </>
                    )}
                    <BattleGrid
                        battles={battles.filter(
                            (battle) => battle && battle.creator_id === user?.id && battle.title && battle.partycode
                        )}
                        isAuthenticated={isAuthenticated}
                        error={error}
                    />
                </div>
                <div>
                    <h2>Battles an denen du teilnimmst:</h2>
                    {isAuthenticated && (
                        <>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setOpenJoin(true)}
                            >
                                Battle beitreten
                            </Button>
                        </>
                    )}
                    <BattleGrid
                        battles={battles.filter(
                            (battle) => battle && battle.creator_id !== user?.id && battle.title && battle.partycode
                        )}
                        isAuthenticated={isAuthenticated}
                        error={error}
                    />
                </div>
            </div>

            {/* Join Battle Dialog */}
            <Dialog open={openJoin} onClose={() => setOpenJoin(false)} maxWidth="sm" fullWidth>
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
                    <Button onClick={() => setOpenJoin(false)}>Abbrechen</Button>
                    <Button onClick={handleSubmitJoin} variant="contained">
                        Battle beitreten!
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Create Battle Dialog */}
            <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
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
                    <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
                    <Button onClick={handleSubmitCreate} variant="contained">
                        Create Battle
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Battles;
