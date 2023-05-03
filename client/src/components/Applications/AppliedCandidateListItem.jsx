import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";

import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import ProfileAvatar from "../Utils/ProfileAvatar";

/*
 * A component that this display each Applied Candidate of a job
 */
function AppliedCandidateListItem(props) {
    const { candidateProfile, onListItemSelected } = props;
    const { profile, applicationInfo } = candidateProfile;

    // Handle event when a candidate list item is clicked
    const handleClick = () => {
        onListItemSelected(candidateProfile);
    };

    return (
        <>
            <ListItem alignItems="flex-start" onClick={handleClick}>
                <ListItemAvatar>
                    <ProfileAvatar fullName={profile.fullName} />
                </ListItemAvatar>
                <Stack>
                    <Typography variant="body1" fontWeight={500}>
                        {profile.fullName}
                    </Typography>
                    <Typography variant="body2">
                        {applicationInfo.status}
                    </Typography>
                </Stack>
            </ListItem>
        </>
    );
}
export default AppliedCandidateListItem;
