import {
    Container
} from '@mui/material';
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Party: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Container maxWidth="lg" className='home-video'>
            <h1 className="text-primary">rwar</h1>
        </Container>
    );
};

export default Party;
