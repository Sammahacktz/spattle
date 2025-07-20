import { Visibility, VisibilityOff } from '@mui/icons-material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
    Box,
    Card,
    CardContent,
    Chip,
    FormControl,
    Grid,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
    Typography
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Battle } from '../types';

interface BattleGridProps {
    battles: Battle[];
    error?: string;
}
export const BattleGrid: React.FC<BattleGridProps> = ({ battles, error }) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleCopy = (partycode: string) => {
        navigator.clipboard.writeText(partycode);
    };
    const navigate = useNavigate();

    return (
        <>
            <Grid container spacing={3}>
                {battles.map((battle) => (
                    <Grid key={battle.id}>
                        <Card
                            onClick={() => { navigate(`/battle/party/${battle.partycode}`) }}
                            className={"spattle-card battle-card"}
                            sx={{ cursor: "pointer" }}
                        >
                            <CardContent>
                                <Typography variant="h6" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    {battle.title}
                                    <Chip
                                        label={battle.is_active ? "Aktiv" : "Beendet"}
                                        color={battle.is_active ? "success" : "error"}
                                        size="small"
                                        sx={{ ml: 1 }}
                                    />
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {battle.description || 'No description available'}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" component="div">
                                    <FormControl variant="standard" fullWidth sx={{ mt: 1, maxWidth: 200 }}>
                                        <InputLabel htmlFor={`partycode_hidden_${battle.id}`}>Partycode</InputLabel>
                                        <Input
                                            id={`partycode_hidden_${battle.id}`}
                                            type={showPassword ? 'text' : 'password'}
                                            value={battle.partycode}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    {showPassword && <IconButton
                                                        aria-label="copy partycode"
                                                        onClick={() => handleCopy(battle.partycode)}
                                                        edge="end"
                                                        size="small"
                                                    >
                                                        <ContentCopyIcon fontSize="small" />
                                                    </IconButton>}
                                                    <IconButton
                                                        aria-label={
                                                            showPassword ? 'hide the password' : 'display the password'
                                                        }
                                                        onClick={handleClickShowPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            readOnly
                                        />
                                    </FormControl>
                                </Typography>

                                <Typography variant="caption" display="block" color="text.secondary">
                                    Erstellt am: {new Date(battle.created_at).toLocaleDateString()}
                                </Typography>

                            </CardContent>
                        </Card>
                    </Grid >
                ))}
            </Grid >

            {
                battles.length === 0 && !error && (
                    <Box textAlign="center" py={8}>
                        <Typography variant="h6" color="text.secondary">
                            Bislang noch ziemlich leer hier ...
                        </Typography>
                    </Box>
                )
            }
        </>
    )

}