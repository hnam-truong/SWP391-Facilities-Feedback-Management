import React from 'react'
import ExpiredFeedback from './data/ExpiredFeedback'
import ExpiredTask from './data/ExpiredTask'
import MaxFeedback from './data/MaxFeedback'
import MaxTask from './data/MaxTask'
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';

export default function SystemHandler() {
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid xs={8} md={6}>
                        <ExpiredFeedback />
                        <ExpiredTask />
                    </Grid>
                    <Grid xs={8} md={6}>
                        <MaxFeedback />
                        <MaxTask />
                    </Grid>
                </Grid>
            </Box>
        </DashboardLayout>
    )
}
