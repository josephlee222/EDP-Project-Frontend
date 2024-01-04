import React from 'react'
import { Typography, Box } from '@mui/material'
import { useTheme } from '@emotion/react';

export default function PageHeader(props) {
    const theme = useTheme();
    return (
        <Box display={"flex"} sx={{ py: "3rem", justifyContent: "center", alignItems: "center", flexDirection: "column", backgroundColor: theme.palette.background.paper }}>
            <props.icon sx={{ height: "72px", width: "72px", color: "primary" }} color="primary" />
            <Typography fontWeight={700} variant="h4" component="h1" align="center" mt={"0.5rem"}>
                {props.title}
            </Typography>
        </Box>
    )
}