import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DoneIcon from '@mui/icons-material/Done';
import {
    Box,
    IconButton,
    Typography
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';

type RewardMark = { title: string; target?: number, description?: string | undefined };
interface CustomProgressBarProps {
    value: number;
    max: number;
    rewards: RewardMark[];
    detailed?: boolean;
    activityParts?: StravaRunData[];
}

interface MarkLabelProps {
    label: string;
    description: string | undefined;
    percent: number;
    position: 'top' | 'bottom';
}


export const CustomProgressBar: React.FC<CustomProgressBarProps> = ({ value, max, rewards, activityParts, detailed = false }) => {
    const marks = rewards.map((r, i) => ({
        value: r.target,
        label: r.title || `Belohnung ${i + 1}`,
        percent: max > 0 ? (r.target! / max) * 100 : 0,
        description: detailed ? r.description : undefined
    }));
    const animatedPercent = max > 0 ? (value / max) * 100 : 0;
    const [tooltipOpenIdx, setTooltipOpenIdx] = React.useState<number | null>(null);

    return (
        <Box sx={{ position: 'relative', width: '100%', height: 80, px: 2 }}>

            <Box sx={{ position: 'absolute', left: 0, right: 0, top: 32, height: 8, bgcolor: '#ddd', borderRadius: 4 }}>
                {activityParts?.map()}
                <Box sx={{
                    position: 'absolute',
                    left: 0,
                    width: `${animatedPercent}%`,
                    top: 0,
                    height: 8,
                    bgcolor: 'primary.main',
                    borderRadius: 4,
                    transition: 'width 2s',
                }} />
                <Box sx={{
                    position: 'absolute',
                    left: `${animatedPercent}%`,
                    top: '-15px',
                    transform: 'translate(-50%, 0)',
                    zIndex: 4,
                    fontSize: 25,
                    pointerEvents: 'none',
                    transition: 'left 2s',
                }}>
                    🏃‍➡️
                </Box>
                {marks.map((mark, i) => (
                    (detailed ? (
                        <Box key={i} sx={{ position: 'absolute', left: `${mark.percent}%`, top: -10, transform: 'translateX(-50%)', zIndex: 2, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Tooltip
                                title={
                                    <>
                                        <Typography variant="subtitle2">{mark.label}</Typography>
                                        {mark.description && <Typography variant="caption">{mark.description}</Typography>}
                                    </>
                                }
                                open={tooltipOpenIdx === i}
                                onClose={() => setTooltipOpenIdx(null)}
                                disableHoverListener
                                disableTouchListener
                                arrow
                            >
                                <IconButton
                                    size="small"
                                    sx={{
                                        width: 26,
                                        height: 26,
                                        borderRadius: '50%',
                                        boxShadow: 2,
                                        border: '2px solid',
                                        borderColor: value >= mark.value! ? "green" : 'primary.main',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        p: 0,
                                        backgroundColor: value >= mark.value! ? "#a7f7a7" : '#fff',
                                        opacity: 1,
                                        transition: 'background 0.5s',
                                        '&:hover': {
                                            backgroundColor: '',
                                        },
                                    }}
                                    tabIndex={-1}
                                    disableRipple
                                    onClick={e => {
                                        e.stopPropagation();
                                        setTooltipOpenIdx(tooltipOpenIdx === i ? null : i);
                                    }}
                                >
                                    {value >= mark.value! ? (
                                        <DoneIcon fontSize="small" sx={{ color: 'green' }} />
                                    ) : (
                                        <AccessTimeIcon fontSize="medium" />
                                    )}
                                </IconButton>
                            </Tooltip>
                        </Box>) : (<Box key={i} sx={{ position: 'absolute', left: `${mark.percent}%`, top: -1, transform: 'translateX(-50%)', zIndex: 2, width: 10, height: 10, border: "1px solid", borderColor: value >= mark.value! ? "#fff" : 'blue', borderRadius: "50%", backgroundColor: value >= mark.value! ? "blue" : '#fff', }} ></Box>))
                ))}
            </Box>
        </Box >
    );
};