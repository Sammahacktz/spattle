import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    IconButton,
    Input,
    InputAdornment,
    Rating,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChallengeCard } from '../components/Challenge';
import { CustomProgressBar } from '../components/ChallengeMeter';
import { SideNavbar } from '../components/sideNavbar';
import { useAuth } from '../contexts/AuthContext';
import { battlesAPI } from '../services/api';
import { Challenge, ChallengeCreate, RewardCreate, User } from '../types';



export const Party: React.FC = () => {
    const { user } = useAuth();
    const { partycode } = useParams<{ partycode: string }>();
    const [challenges, setChanllenges] = useState<Challenge[]>([])
    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState<User[]>([user!]);
    const [error, setError] = useState('');
    const [distance, SetDistance] = useState<string>("");



    const [form, setForm] = useState<ChallengeCreate & { rewards: RewardCreate[] }>({
        title: '',
        description: '',
        max_value: 100,
        assigned_user_id: 0,
        partycode: partycode!,
        creator_id: user?.id || 0,
        value: 0,
        icon: '🏁',
        start_datetime: '',
        end_datetime: '',
        rewards: [
            { title: '', description: '', target: 0, challenge_id: 0 }
        ]
    });

    useEffect(() => {
        if (user) {
            loadUserBattles(partycode!);
            loadChallengesForBattle(partycode!);
        }
    }, [user]);

    const loadUserBattles = async (partycode: string) => {
        try {
            // Fetch battles where the user is a member (participant or creator)
            const data = await battlesAPI.getBattleUsers(partycode);
            setUsers(data);
        } catch (err: any) {
            setError('Failed to load battles');
        }
    };

    const loadChallengesForBattle = async (partycode: string) => {
        try {
            // Fetch battles where the user is a member (participant or creator)
            const data = await battlesAPI.getChallengesForBattle(partycode);
            setChanllenges(data);
        } catch (err: any) {
            setError('Failed to load battles');
        }
    };

    const updateUsersDistance = async (distance: number) => {
        try {
            SetDistance("")
            await battlesAPI.updateUsersDistance(distance);
            await loadChallengesForBattle(partycode!);

        } catch (err: any) {
            setError('Failed to load battles');
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRewardChange = (idx: number, field: string, value: any) => {
        const rewards = [...form.rewards];
        rewards[idx] = { ...rewards[idx], [field]: value };
        setForm({ ...form, rewards });
    };

    const handleAddReward = () => {
        setForm({
            ...form,
            rewards: [...form.rewards, { title: '', description: '', target: form.max_value, challenge_id: 0 }]
        });
    };

    const handleDeleteReward = (idx: number) => {
        setForm({
            ...form,
            rewards: form.rewards.filter((_, i) => i !== idx)
        });
    };

    const handleChallengeCreate = async () => {
        if (!user) {
            setError('You must be logged in to create a battle.');
            return;
        }
        try {
            const newChallenge = await battlesAPI.createChallenge({ ...form, creator_id: user.id, partycode: partycode! });
            setChanllenges([newChallenge, ...challenges]);
            setOpen(false);
            setForm({
                title: '',
                description: '',
                max_value: 100,
                assigned_user_id: 0,
                partycode: partycode!,
                creator_id: user?.id || 0,
                value: 0,
                icon: '🏁',
                rewards: [
                    { title: '', description: '', target: 0, challenge_id: 0 }
                ]
            });
        } catch (err: any) {
            setError('Failed to create battle');
        }

    }

    return (
        <Container maxWidth="lg" className='home-video'>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <SideNavbar>
                <Box
                    display="flex"
                    flexDirection="column"
                    gap={2}
                    p={2}
                    sx={{
                        bgcolor: (theme) => theme.palette.primary.main,
                        color: '#fff',
                        borderRadius: 2,
                        boxShadow: 1,
                        minWidth: 180
                    }}
                >
                    <strong>Partymitglieder:</strong>
                    {users.filter(u => u && u.username).map((u) => (
                        <Box key={u.id} sx={{ bgcolor: '#fff', color: '#000', borderRadius: 2, boxShadow: 1, p: 1, minWidth: 180 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                                {(u.username ? u.username.charAt(0).toUpperCase() + u.username.slice(1) : 'Unbekannt')}
                            </Typography>
                            <Rating name="half-rating-read" defaultValue={0} precision={0.5} readOnly />
                        </Box>
                    ))}
                </Box>
            </SideNavbar>
            <Box display="flex" justifyContent="center" sx={{ position: "relative", zIndex: 99, }} alignItems="stretch" gap={2} mb={2}>
                <Input
                    value={distance}
                    id="standard-adornment-weight"
                    endAdornment={<InputAdornment position="end">Km</InputAdornment>}
                    aria-describedby="standard-weight-helper-text"
                    inputProps={{
                        'aria-label': 'weight',
                    }}
                    sx={{
                        maxWidth: "22ch"
                    }}
                    placeholder='gelaufene Kilomenter'
                    onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => SetDistance(event.target.value)}
                />
                <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ height: '100%' }}
                    onClick={() => updateUsersDistance(Number(distance))}
                >
                    UPDATE!
                </Button>
            </Box>
            <h1 className="text-primary">Challenges:</h1>
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Neue Challenge erstellen</DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 2, pt: 5 }}>
                        <TextField
                            label="Titel"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Beschreibung"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={2}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Startzeitpunkt"
                            name="start_datetime"
                            type="datetime-local"
                            value={form.start_datetime}
                            onChange={handleChange}
                            fullWidth
                            sx={{ mb: 2 }}
                            slotProps={{ inputLabel: { shrink: true } }}

                        />
                        <TextField
                            label="Endzeitpunkt"
                            name="end_datetime"
                            type="datetime-local"
                            value={form.end_datetime}
                            onChange={handleChange}
                            fullWidth
                            sx={{ mb: 2 }}
                            slotProps={{ inputLabel: { shrink: true } }}
                        />
                        <Autocomplete
                            options={users.filter(u => u && typeof u.id === 'number' && u.username)}
                            getOptionLabel={(option) => option.username}
                            value={users.filter(u => u && typeof u.id === 'number' && u.username).find(u => u.id === form.assigned_user_id) || null}
                            onChange={(_, value) => setForm({ ...form, assigned_user_id: value ? value.id : 0 })}
                            loading={users.length === 0}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Zuweisen an Nutzer"
                                    name="assigned_user_id"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                />
                            )}
                        />
                        <Box display="flex" alignItems="center" gap={2}>
                            <Box flex={1}>
                                <CustomProgressBar
                                    value={form.value}
                                    max={form.max_value}
                                    rewards={form.rewards}
                                />
                            </Box>
                            <Box width={120}>
                                <TextField
                                    label="Max. Kilometer"
                                    name="max_value"
                                    type="number"
                                    value={form.max_value}
                                    onChange={e => setForm({ ...form, max_value: Number(e.target.value) })}
                                    fullWidth
                                />
                            </Box>
                        </Box>
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle1">Belohnungen</Typography>
                            {form.rewards.map((reward, idx) => (
                                <Box display="flex" alignItems="center" gap={2} key={idx} sx={{ mb: 1 }}>
                                    <TextField
                                        label="Name"
                                        value={reward.title}
                                        onChange={e => handleRewardChange(idx, 'title', e.target.value)}
                                        sx={{ flex: 1 }}
                                    />
                                    <TextField
                                        label="Beschreibung"
                                        value={reward.description}
                                        onChange={e => handleRewardChange(idx, 'description', e.target.value)}
                                        sx={{ flex: 2 }}
                                    />
                                    <TextField
                                        label="bei Kilometer"
                                        type="number"
                                        value={reward.target}
                                        onChange={e => handleRewardChange(idx, 'target', Number(e.target.value))}
                                        sx={{ width: 120 }}
                                    />
                                    <IconButton onClick={() => handleDeleteReward(idx)} color="error">
                                        <RemoveIcon />
                                    </IconButton>
                                </Box>
                            ))}
                            <IconButton onClick={handleAddReward} color="primary">
                                <AddIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Abbrechen</Button>
                    <Button onClick={handleChallengeCreate} variant="contained" color="primary">
                        Challenge erstellen
                    </Button>
                </DialogActions>
            </Dialog>
            <Box display="flex"
                flexWrap="wrap"
                gap={2}
                mt={3}
            >
                {challenges.map((challenge) => (
                    <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
                <Fab
                    color="primary"
                    aria-label="add"
                    className='ms-5'
                    onClick={() => setOpen(true)}
                    sx={{
                        zIndex: 1,
                        width: 40,
                        height: 40,
                        ml: 2,
                        boxShadow: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: "center"
                    }}
                >
                    <AddIcon sx={{ fontSize: 30 }} />
                </Fab>
            </Box>
        </Container>
    );
};


export default Party;
