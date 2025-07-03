import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import SyncIcon from '@mui/icons-material/Sync';
import {
    Avatar,
    Box,
    Card,
    Chip,
    IconButton,
    Stack,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { StravaAPI } from '../services/api';
import { Challenge } from '../types';
import { CustomProgressBar } from './ChallengeMeter';
import { SimpleMap } from './Map';

interface ChallengeProps {
    challenge: Challenge;
}
export const ChallengeCard: React.FC<ChallengeProps> = ({ challenge }) => {
    const [expandedChallenge, setExpandedChallenge] = useState<number | null>(null);
    const [position, setPosition] = useState<[number, number]>([51.505, -0.09]);
    const [stravaData, setStravaData] = useState<StravaRunData[]>([]);
    const { user } = useAuth();
    useEffect(() => {
        if (expandedChallenge === challenge.id && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
                () => setPosition([51.505, -0.09])
            );
        }
    }, [expandedChallenge, challenge.id]);


    const handleStravaConnection = async () => {
        const url = await StravaAPI.getStravaLink();
        if (url.link) {
            window.location.href = url.link; // Open in same tab to preserve auth context
        }
        //TODO: handle error
    }

    const handleStravaSync = async () => {
        const data = await StravaAPI.getLastRunFromAthlete();
        setStravaData(data)
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
                    height: expandedChallenge === challenge.id ? '95vh' : 'auto',
                    transition: 'width 0.3s, height 0.3s',
                    cursor: expandedChallenge !== challenge.id ? 'pointer' : 'default',
                    zIndex: expandedChallenge === challenge.id ? 10 : 1,
                    position: expandedChallenge === challenge.id ? 'fixed' : 'relative',
                    top: expandedChallenge === challenge.id ? '5rem' : 'auto',
                    left: expandedChallenge === challenge.id ? '2.5vw' : 'auto',
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
                    <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 20 }}>
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
                        />
                    </Box>
                    <Box mt={1}>
                        <Typography variant="caption" color="text.secondary">
                            {challenge.start_datetime} - {challenge.end_datetime}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'stretch', height: "100%", gap: 2 }}>
                        <Card sx={{ width: '50%', height: '100%', mt: 2 }}>
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
                        <Card sx={{ minWidth: '49%', height: '90%' }}>
                            <Typography variant="h6" gutterBottom>
                                <Box mt={2} display="flex" justifyContent="center">
                                    <span>                                Aktivität:
                                    </span>
                                    {user?.strava_refresh_token ? (
                                        <IconButton onClick={handleStravaSync} style={{ background: '#fc4c02', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}>
                                            <SyncIcon className='me-3' /> Mit Strava synchronisieren
                                        </IconButton>
                                    ) : (
                                        <button onClick={handleStravaConnection} style={{ background: '#fc4c02', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}>
                                            Strava verbinden
                                        </button>
                                    )}
                                </Box>

                            </Typography>
                            <Box sx={{ width: '100%', height: '100%', mt: 2 }}>
                                {position && (
                                    <SimpleMap position={position}></SimpleMap>
                                )}
                            </Box>
                        </Card>
                    </Box>
                </>)}
            </Box >
        </>
    )

}
