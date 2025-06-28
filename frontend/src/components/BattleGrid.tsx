import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Grid,
    Typography
} from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { Battle } from '../types';

interface BattleGridProps {
    battles: Battle[];
    isAuthenticated: boolean;
    error?: string;
}
export const BattleGrid: React.FC<BattleGridProps> = ({ battles, isAuthenticated, error }) => {
    return (
        <>
            <Grid container spacing={3}>
                {battles.map((battle) => (
                    <Grid key={battle.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" component="h3" gutterBottom>
                                    {battle.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {battle.description || 'No description available'}
                                </Typography>
                                <Chip
                                    label={battle.is_active ? "Aktiv" : "Beendet"}
                                    color={battle.is_active ? "success" : "error"}
                                    size="small"
                                    sx={{ mb: 1 }}
                                />
                                <Typography variant="caption" display="block" color="text.secondary">
                                    Created: {new Date(battle.created_at).toLocaleDateString()}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    component={Link}
                                    to={`/battle/party/${battle.partycode}`}
                                >
                                    Details
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {battles.length === 0 && !error && (
                <Box textAlign="center" py={8}>
                    <Typography variant="h6" color="text.secondary">
                        No battles available yet.
                    </Typography>
                    {isAuthenticated && (
                        <Typography variant="body2" color="text.secondary">
                            Be the first to create one!
                        </Typography>
                    )}
                </Box>
            )}
        </>
    )

}