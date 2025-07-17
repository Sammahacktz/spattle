import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import ReplayIcon from '@mui/icons-material/Replay';
import {
    Avatar,
    Box,
    Button,
    Card,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    IconButton,
    Paper,
    Stack,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { StravaAPI } from '../services/api';
import { Challenge, StravaRunData } from '../types';
import { CustomProgressBar } from './ChallengeMeter';
import { SimpleMap } from './Map';

interface ChallengeProps {
    challenge: Challenge;
    onRefresh: () => {};
}
export const ChallengeCard: React.FC<ChallengeProps> = ({ challenge, onRefresh }) => {
    const [expandedChallenge, setExpandedChallenge] = useState<number | null>(null);
    const [stravaData, setStravaData] = useState<StravaRunData[]>([]);
    const [selectedStravaRun, setSelectedStravaRun] = useState<StravaRunData | undefined>(undefined);
    const [stravaDialogOpen, setStravaDialogOpen] = useState<boolean>(false);
    const [stravaAgreement, setStravaAgreement] = useState<boolean>(false);

    const { user } = useAuth();
    useEffect(() => {
        if (expandedChallenge && challenge.assigned_user.strava_refresh_token) {
            handleStravaSync(false)
        }
    }, [expandedChallenge]);


    const handleStravaConnection = async () => {
        const url = await StravaAPI.getStravaLink();
        if (url.link) {
            window.location.href = url.link;
        }
    }

    const handleStravaSync = async (refresh: boolean = true) => {
        const data = await StravaAPI.getLastRunFromAthlete(challenge.assigned_user.username);
        setStravaData(data)
        setSelectedStravaRun(data.filter((value) => challenge.activity_ids.includes(value.id))[0] ?? undefined)
        onRefresh()
    }

    return (
        <>
            <Box
                key={challenge.id}
                onClick={expandedChallenge !== challenge.id ? () => setExpandedChallenge(challenge.id) : undefined}
                sx={{
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    p: 2,
                    minWidth: 300,
                    boxShadow: 1,
                    background: '#fff',
                    width: expandedChallenge === challenge.id ? '95vw' : 300,
                    minHeight: expandedChallenge === challenge.id ? '90vh' : 'auto',
                    maxHeight: expandedChallenge === challenge.id ? '90vh' : 'none',
                    transition: 'width 0.3s, height 0.3s',
                    cursor: expandedChallenge !== challenge.id ? 'pointer' : 'default',
                    zIndex: expandedChallenge === challenge.id ? 10 : 1,
                    position: expandedChallenge === challenge.id ? 'fixed' : 'relative',
                    top: expandedChallenge === challenge.id ? '5rem' : 'auto',
                    left: expandedChallenge === challenge.id ? '2.5vw' : 'auto',
                    overflowY: expandedChallenge === challenge.id ? 'auto' : 'visible',
                }}
            >
                {expandedChallenge !== challenge.id ? (<>
                    <Typography variant="h6" gutterBottom>
                        {challenge.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom component="div">
                        <Stack direction="row" spacing={1}>
                            <Chip color="primary" avatar={<Avatar>{challenge.assigned_user?.username[0].toUpperCase() ?? "U"}</Avatar>} label={challenge.assigned_user?.username ?? "unknown"} />
                        </Stack>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        {challenge.description}
                    </Typography>
                    <Typography variant="body2">
                        Max: {challenge.max_value} km
                    </Typography>
                    <Typography variant="body2">
                        Fortschritt: {challenge.value} / {challenge.max_value} km
                    </Typography>
                    <Box mt={1}>
                        <CustomProgressBar
                            value={challenge.value}
                            max={challenge.max_value!}
                            rewards={challenge.rewards!}
                        />
                    </Box>
                    <Box mt={1}>
                        <Typography variant="caption" color="text.secondary">
                            {challenge.start_datetime} - {challenge.end_datetime}
                        </Typography>
                    </Box>
                </>) : (<>
                    <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 20, maxHeight: "90vh" }}>
                        <IconButton size="small" onClick={e => { e.stopPropagation(); setExpandedChallenge(null); }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Typography variant="h4" gutterBottom>
                        {challenge.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        {challenge.description}
                    </Typography>
                    <Typography variant="body1">
                        Max: {challenge.max_value} km
                    </Typography>
                    <Typography variant="body1">
                        Fortschritt: {challenge.value} / {challenge.max_value} km
                    </Typography>
                    <Typography variant="body1">
                        Challenger: {challenge.assigned_user?.username ?? "Unknown"}
                    </Typography>
                    <Box mt={1} mx={3}>
                        <CustomProgressBar
                            value={challenge.value}
                            max={challenge.max_value!}
                            rewards={challenge.rewards!}
                            detailed={true}
                            activityParts={stravaData.filter((entry) => challenge.activity_ids.includes(entry.id))}
                            onSelect={(entry) => setSelectedStravaRun(entry)}
                        />
                    </Box>
                    <Box mt={1}>
                        <Typography variant="caption" color="text.secondary">
                            {challenge.start_datetime} - {challenge.end_datetime}
                        </Typography>
                    </Box>

                    <Box sx={{ position: "relative", display: 'flex', gap: 2 }} className="flex-column flex-md-row">
                        <Card className="mb-3 flex-fill" sx={{ width: { xs: '100%', md: '50%' }, height: '100%', mt: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Verdiente Belohnungen:
                            </Typography>
                            <Box sx={{ width: '100%', minHeight: '50%', mt: 2, maxHeight: 300, overflowY: 'scroll' }}>
                                {challenge.rewards && challenge.rewards.length > 0 ? (
                                    <Stack spacing={2}>
                                        {challenge.rewards.sort((a, b) => a.target! - b.target!).map((reward, idx) => (
                                            <Card key={idx} sx={{ display: 'flex', alignItems: 'stretch', p: 1 }}>
                                                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                    <Typography variant="body1">{reward.title}</Typography>
                                                    <Typography variant="body2" color="text.secondary">{reward.description}</Typography>
                                                </Box>
                                                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {reward.target! - challenge.value <= 0 ?
                                                        (<Typography variant="body2" color="green">Belohnung erreicht!</Typography>)
                                                        :
                                                        (<Typography variant="body2" color="text.secondary">
                                                            {`noch ${(reward.target! - challenge.value).toLocaleString('de-DE', { maximumFractionDigits: 1 })} KM bis zur Belohnung!`}
                                                        </Typography>)
                                                    }
                                                </Box>
                                                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {reward.target! <= challenge.value ? (
                                                        <DoneIcon fontSize="small" sx={{ color: 'green' }} />
                                                    ) : (
                                                        <AccessTimeIcon fontSize="medium" />)}
                                                </Box>
                                            </Card>
                                        ))}
                                    </Stack>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        Keine Belohnungen vorhanden.
                                    </Typography>
                                )}
                            </Box>
                        </Card>
                        <Card className="mb-3 flex-fill" sx={{ minWidth: { xs: '100%', md: '49%' }, height: '100%', position: 'relative' }}>
                            <Typography variant="h6" gutterBottom>
                                <Box mt={2} display="flex" justifyContent="center">
                                    <span>   Aktivität:
                                    </span>
                                </Box>
                            </Typography>
                            <Card sx={{ position: "relative", width: "100%", height: "4rem", zIndex: "200" }}>
                                <Grid container spacing={2}>
                                    <Grid size={4}>
                                        <Paper>Name: {selectedStravaRun?.name ?? "-"}</Paper>
                                    </Grid>
                                    <Grid size={4}>
                                        <Paper>Distanz: {selectedStravaRun?.distance ?? "-"}</Paper>
                                    </Grid>
                                    <Grid size={4}>
                                        <Paper>Geschwindigkeit: {selectedStravaRun?.moving_time ?? "-"}</Paper>
                                    </Grid>
                                    <Grid size={4}>
                                        <Paper>Durchs. Herzrate: {selectedStravaRun?.average_heartrate ?? "-"}</Paper>
                                    </Grid>
                                    <Grid size={4}>
                                        <Paper>
                                            Benötigte Zeit: {selectedStravaRun?.elapsed_time != null
                                                ? `${Math.round(selectedStravaRun.elapsed_time / 60)} min`
                                                : "-"}
                                        </Paper>
                                    </Grid>
                                    <Grid size={4}>
                                        <Paper>Höhenmeter: {selectedStravaRun?.total_elevation_gain ?? "-"}m</Paper>
                                    </Grid>
                                    <Grid size={4}>
                                        <Paper>Max Speed: {selectedStravaRun?.max_speed ?? "-"}</Paper>
                                    </Grid>
                                </Grid>
                            </Card>
                            <Box sx={{ width: "100%", minHeight: '350px', position: 'relative' }}>
                                {!user?.strava_refresh_token && challenge.assigned_user.id === user?.id ? (
                                    <Box sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 122,
                                        background: 'rgba(255,255,255,0.85)',
                                    }}>
                                        <button onClick={() => setStravaDialogOpen(true)} style={{ background: '#fc4c02', color: '#fff', border: 'none', borderRadius: 4, padding: '16px 32px', cursor: 'pointer', fontSize: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                                            Strava verbinden
                                        </button>
                                    </Box>
                                ) : selectedStravaRun ? (
                                    <Box>
                                        <SimpleMap stravaPolyline={selectedStravaRun.map?.summary_polyline} />
                                    </Box>
                                ) : (
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minHeight: "350px"
                                    }}>
                                        Keine Strava daten verfügbar <IconButton onClick={() => handleStravaSync()}><ReplayIcon /></IconButton>
                                    </Box>
                                )}
                            </Box>
                        </Card>
                    </Box>
                </>)}
            </Box >
            <Dialog open={stravaDialogOpen} onClose={() => setStravaDialogOpen(false)}>
                <DialogTitle>Strava Account verbinden</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>
                        Um deine Strava-Aktivitäten zu synchronisieren, musst du deinen Strava-Account verbinden und der Datenübertragung zustimmen. Dabei sind folgende Daten für die mitgleider deines Battles sichtbar: laufname, Distanz, tempo, Herzfrequenz, ...
                    </Typography>
                    <FormControlLabel
                        control={<Checkbox checked={stravaAgreement} onChange={e => setStravaAgreement(!stravaAgreement)} name="stravaConsent" />}
                        label="Ich bin damit einverstanden, dass meine Strava-Aktivitäten für diese Challenge verwendet werden und für Battlemitglieder Sichtbar sind."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setStravaDialogOpen(false)} color="error">Ablehnen</Button>
                    <Button onClick={handleStravaConnection} color="primary" variant="contained" disabled={!stravaAgreement}>Bestätigen</Button>
                </DialogActions>
            </Dialog>
        </>
    )

}
