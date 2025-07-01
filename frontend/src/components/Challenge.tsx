import CloseIcon from '@mui/icons-material/Close';
import {
    Avatar,
    Box,
    Chip,
    IconButton,
    Stack,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import { Challenge } from '../types';
import { CustomProgressBar } from './ChallengeMeter';

interface ChallengeProps {
    challenge: Challenge;
}
export const ChallengeCard: React.FC<ChallengeProps> = ({ challenge }) => {
    const [expandedChallenge, setExpandedChallenge] = useState<number | null>(null);

    return (
        <>
            <Box
                key={challenge.id}
                onClick={() => setExpandedChallenge(challenge.id)}
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
                    cursor: 'pointer',
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
                    <Typography variant="body2" color="text.secondary" gutterBottom>
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
                    <Box mt={1}>
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
                </>)}
            </Box>
        </>
    )

}
