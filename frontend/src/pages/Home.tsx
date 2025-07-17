import {
    Box,
    Container
} from '@mui/material';
import React from 'react';

import logo1 from '../logo1.png';



const Home: React.FC = () => {

    return (
        <Container maxWidth="lg" className='home-video'>
            <Box sx={{ textAlign: 'center' }}>
                <img src={logo1} alt="Spattle Logo" style={{ maxWidth: '500px', width: '100%' }} />
            </Box>
        </Container>
    );
};

export default Home;
