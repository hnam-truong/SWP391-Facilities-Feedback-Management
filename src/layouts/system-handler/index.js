import React from 'react'
import ExpiredFeedback from './data/ExpiredFeedback'
import ExpiredTask from './data/ExpiredTask'
import MaxFeedback from './data/MaxFeedback'
import MaxTask from './data/MaxTask'
import Card from "@mui/material/Card";
import BasicLayout from "layouts/authentication/components/BasicLayout";

export default function SystemHandler() {
    return (
        <BasicLayout image="">
            <Card>
                <ExpiredFeedback />
            </Card>
        </BasicLayout>
    )
}
