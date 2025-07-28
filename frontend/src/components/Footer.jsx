import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';

export const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[800],
            }}
        >
            <Container maxWidth="lg">
                <Typography variant="body2" color="text.secondary" align="center">
                    {'Copyright © '}
                    <Link color="inherit" href="https://mui.com/">
                        MyCows_RFI
                    </Link>{' '}
                    {new Date().getFullYear()}{'.'}
                </Typography>
            </Container>
        </Box>
    );
};