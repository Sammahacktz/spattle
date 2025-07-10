import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DoneIcon from '@mui/icons-material/Done';
import {
    Box,
    IconButton,
    Typography
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';
import { StravaRunData } from '../types';

type RewardMark = { title: string; target?: number, description?: string | undefined };
interface CustomProgressBarProps {
    value: number;
    max: number;
    rewards: RewardMark[];
    detailed?: boolean;
    activityParts?: StravaRunData[];
    onSelect?: (entry: StravaRunData) => void;
}

// Fixed color palette for activity segments
const colorPalette = [
    '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe',
    '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080'
];
const getColorForActivity = (activity: StravaRunData, idx: number) => {
    if (activity.id !== undefined && activity.id !== null) {
        return colorPalette[Math.abs(Number(activity.id)) % colorPalette.length];
    }
    return colorPalette[idx % colorPalette.length];
};


export const CustomProgressBar: React.FC<CustomProgressBarProps> = ({ value, max, rewards, activityParts, detailed = false, onSelect = () => { } }) => {
    const marks = rewards.map((r, i) => ({
        value: r.target,
        label: r.title || `Belohnung ${i + 1}`,
        percent: max > 0 ? (r.target! / max) * 100 : 0,
        description: detailed ? r.description : undefined
    }));
    const animatedPercent = max > 0 ? (value / max) * 100 : 0;
    const [tooltipOpenIdx, setTooltipOpenIdx] = React.useState<number | null>(null);
    const [selectedRun, setSelectedRun] = React.useState<number | null>(null);


    return (
        <Box sx={{ position: 'relative', width: '100%', height: 80, px: 2 }}>

            <Box sx={{ position: 'absolute', left: 0, right: 0, top: 32, height: 8, bgcolor: '#ddd', borderRadius: 4 }}>
                {activityParts ? (
                    (() => {
                        const totalPartsKm = activityParts.reduce((sum, p) => (sum + p.distance), 0) / 1000;
                        const diffKm = Math.max(0, value - totalPartsKm);
                        const leftPercent = max > 0 ? (totalPartsKm / max) * 100 : 0;
                        const diffPercent = max > 0 ? (diffKm / max) * 100 : 0;

                        return (
                            <>
                                {activityParts.map((part, i) => (
                                    <Tooltip
                                        key={i}
                                        title={
                                            <>
                                                <Typography variant="subtitle2">{part.name || `Aktivität ${i + 1}`}</Typography>
                                                <Typography variant="caption">
                                                    Distanz: {(part.distance / 1000).toLocaleString('de-DE', { maximumFractionDigits: 2 })} km<br />
                                                    Zeit: {part.elapsed_time ? `${Math.round(part.elapsed_time / 60)} min` : '-'}<br />
                                                    Datum: {part.start_date ? new Date(part.start_date).toLocaleDateString('de-DE') : '-'}
                                                </Typography>
                                                <Typography variant="caption">
                                                    klick für mehr information
                                                </Typography>
                                            </>
                                        }
                                        arrow
                                    >
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                left: `${max > 0 ? (activityParts.slice(0, i).reduce((sum, p) => sum + p.distance / 1000, 0) / max) * 100 : 0}%`,
                                                width: `${max > 0 ? ((part.distance / 1000) / max) * 100 : 0}%`,
                                                top: selectedRun === part.id ? -1 : 0,
                                                height: selectedRun === part.id ? 10 : 8,
                                                bgcolor: getColorForActivity(part, i),
                                                borderRadius: 4,
                                                transition: 'width 2s',
                                                borderLeft: "1px solid white",
                                                borderRight: "1px solid white",
                                                '&:hover': {
                                                    top: -2,
                                                    height: 12,
                                                    opacity: 0.8,
                                                }
                                            }}
                                            onClick={() => { onSelect(part); setSelectedRun(part.id) }}
                                        />
                                    </Tooltip>
                                ))}
                                {/* Difference bar: only show if there is a gap between activity parts and progress */}
                                {diffKm > 0 && (
                                    <Tooltip
                                        key={"diff-activity"}
                                        title={
                                            <>
                                                <Typography variant="subtitle2">Manuell hinzugefügte Strecke</Typography>
                                                <Typography variant="caption">
                                                    Keine weiteren Informationen verfügbar
                                                </Typography>
                                            </>
                                        }
                                        arrow
                                    >
                                        <Box sx={{
                                            position: 'absolute',
                                            left: `${leftPercent}%`,
                                            width: `${diffPercent}%`,
                                            top: 0,
                                            height: 8,
                                            bgcolor: 'blue',
                                            borderRadius: 4,
                                            transition: 'width 2s',
                                            borderLeft: "1px solid #fff",
                                            borderRight: "1px solid #fff",
                                        }} />
                                    </Tooltip>
                                )}
                            </>
                        );
                    })()
                ) : (
                    <Box sx={{
                        position: 'absolute',
                        left: 0,
                        width: `${animatedPercent}%`,
                        top: 0,
                        height: 8,
                        bgcolor: 'primary.main',
                        borderRadius: 4,
                        transition: 'width 2s',
                    }} />)}
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