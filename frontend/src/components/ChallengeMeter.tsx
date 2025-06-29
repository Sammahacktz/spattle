import {
    Box,
    Typography
} from '@mui/material';
import React from 'react';


type RewardMark = { title: string; target?: number };
interface CustomProgressBarProps {
    value: number;
    max: number;
    rewards: RewardMark[];
}

interface MarkLabelProps {
    label: string;
    percent: number;
    position: 'top' | 'bottom';
}

const MarkLabel: React.FC<MarkLabelProps> = ({ label, percent, position }) => (
    <Box
        sx={{
            position: 'absolute',
            left: `${percent}%`,
            transform: 'translateX(-50%)',
            textAlign: 'center',
            top: position === 'top' ? 0 : undefined,
        }}
    >
        <Typography variant="caption" fontWeight={600}>{label}</Typography>
    </Box>
);

export const CustomProgressBar: React.FC<CustomProgressBarProps> = ({ value, max, rewards }) => {
    const marks = rewards.map((r, i) => ({
        value: r.target,
        label: r.title || `Belohnung ${i + 1}`,
        percent: max > 0 ? (r.target! / max) * 100 : 0
    }));
    const progressPercent = max > 0 ? (value / max) * 100 : 0;
    return (
        <Box sx={{ position: 'relative', width: '100%', height: 80, px: 2 }}>
            <Box sx={{ position: 'absolute', left: 0, right: 0, top: 0, height: 24, pointerEvents: 'none' }}>
                {marks.map((mark, i) => (
                    i % 2 === 0 ? (
                        <MarkLabel key={i} label={mark.label} percent={mark.percent} position="top" />
                    ) : null
                ))}
            </Box>
            <Box sx={{ position: 'absolute', left: 0, right: 0, top: 32, height: 8, bgcolor: '#ddd', borderRadius: 4 }}>
                <Box sx={{ position: 'absolute', left: 0, width: `${progressPercent}%`, top: 0, height: 8, bgcolor: 'primary.main', borderRadius: 4 }} />
                <Box sx={{
                    position: 'absolute',
                    left: `${progressPercent}%`,
                    top: '-15px',
                    transform: 'translate(-50%, 0)',
                    zIndex: 4,
                    fontSize: 25,
                    pointerEvents: 'none',
                }}>
                    🏃‍➡️
                </Box>
                {marks.map((mark, i) => (
                    <Box key={i} sx={{ position: 'absolute', left: `${mark.percent}%`, top: -6, width: 16, height: 16, transform: 'translateX(-50%)', zIndex: 2 }}>
                        🏁
                    </Box>
                ))}
            </Box>
            <Box sx={{ position: 'absolute', left: 0, right: 0, top: 56, height: 24, pointerEvents: 'none' }}>
                {marks.map((mark, i) => (
                    i % 2 === 1 ? (
                        <MarkLabel key={i} label={mark.label} percent={mark.percent} position="bottom" />
                    ) : null
                ))}
            </Box>
        </Box>
    );
};