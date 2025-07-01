import {
    Box,
    Typography
} from '@mui/material';
import React from 'react';


type RewardMark = { title: string; target?: number, description?: string | undefined };
interface CustomProgressBarProps {
    value: number;
    max: number;
    rewards: RewardMark[];
    detailed?: boolean;
}

interface MarkLabelProps {
    label: string;
    description: string | undefined;
    percent: number;
    position: 'top' | 'bottom';
}

const MarkLabel: React.FC<MarkLabelProps> = ({ label, percent, position, description }) => (
    <Box
        sx={{
            position: 'absolute',
            left: `${percent}%`,
            transform: 'translateX(-50%)',
            textAlign: 'center',
            top: position === 'top' ? 0 : undefined,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}
    >
        {description ? (
            <details>
                <summary>{label}</summary>
                <Typography variant="caption" fontWeight={400}>{description}</Typography>
            </details>
        ) : (<Typography variant="caption" fontWeight={600}>{label}</Typography>
        )}
    </Box>
);

export const CustomProgressBar: React.FC<CustomProgressBarProps> = ({ value, max, rewards, detailed = false }) => {
    const marks = rewards.map((r, i) => ({
        value: r.target,
        label: r.title || `Belohnung ${i + 1}`,
        percent: max > 0 ? (r.target! / max) * 100 : 0,
        description: detailed ? r.description : undefined
    }));
    const progressPercent = max > 0 ? (value / max) * 100 : 0;
    const [animatedPercent, setAnimatedPercent] = React.useState(progressPercent);
    React.useEffect(() => {
        setAnimatedPercent(progressPercent);
    }, [progressPercent]);
    return (
        <Box sx={{ position: 'relative', width: '100%', height: 80, px: 2 }}>
            {/* Only render top marks if not detailed */}
            {!detailed && (
                <Box sx={{ position: 'absolute', left: 0, right: 0, top: 0, height: 24, pointerEvents: 'none' }}>
                    {marks.map((mark, i) => (
                        i % 2 === 0 ? (
                            <MarkLabel key={i} label={mark.label} percent={mark.percent} position="top" description={mark.description} />
                        ) : null
                    ))}
                </Box>
            )}
            <Box sx={{ position: 'absolute', left: 0, right: 0, top: 32, height: 8, bgcolor: '#ddd', borderRadius: 4 }}>
                <Box sx={{
                    position: 'absolute',
                    left: 0,
                    width: `${animatedPercent}%`,
                    top: 0,
                    height: 8,
                    bgcolor: 'primary.main',
                    borderRadius: 4,
                    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                }} />
                <Box sx={{
                    position: 'absolute',
                    left: `${animatedPercent}%`,
                    top: '-15px',
                    transform: 'translate(-50%, 0)',
                    zIndex: 4,
                    fontSize: 25,
                    pointerEvents: 'none',
                    transition: 'left 1s cubic-bezier(0.4, 0, 0.2, 1)',
                }}>
                    🏃‍➡️
                </Box>
                {marks.map((mark, i) => (
                    <Box key={i} sx={{ position: 'absolute', left: `${mark.percent}%`, top: -6, width: 16, height: 16, transform: 'translateX(-50%)', zIndex: 2 }}>
                        🏁
                    </Box>
                ))}
            </Box>
            {detailed ? (
                <Box sx={{ position: 'absolute', left: 0, right: 0, top: 56, height: 24 }}>
                    {marks.map((mark, i) => (
                        <MarkLabel key={i} label={mark.label} percent={mark.percent} position="bottom" description={mark.description} />
                    ))}
                </Box>
            ) : (
                <Box sx={{ position: 'absolute', left: 0, right: 0, top: 56, height: 24, pointerEvents: 'none' }}>
                    {marks.map((mark, i) => (
                        i % 2 === 1 ? (
                            <MarkLabel key={i} label={mark.label} percent={mark.percent} position="bottom" description={mark.description} />
                        ) : null
                    ))}
                </Box>
            )}
        </Box>
    );
};