import React from "react";

import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import ProfileAvatar from "../Utils/ProfileAvatar";

import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

/**
 * A component to render each Candidate item of the Candidate List
 */
function CandidateListItem(props) {
    const { candidateProfile, onCandidateSelected } = props;
    const { profile, skills } = candidateProfile;

    // Bind the selected candidate to the list container.
    const handleCandidateSelected = () => {
        onCandidateSelected(candidateProfile);
    };

    return (
        <>
            {candidateProfile && (
                <ListItem
                    alignItems="flex-start"
                    className="list-container"
                    sx={{ p: 2 }}
                    onClick={handleCandidateSelected}
                >
                    <ListItemAvatar>
                        <ProfileAvatar fullName={profile.fullName} />
                    </ListItemAvatar>
                    <Grid container alignItems="center">
                        <Grid item xs={12} sm={4}>
                            <Stack>
                                <Typography variant="subtitle" fontWeight={500}>
                                    {profile.fullName}
                                </Typography>
                                <Stack direction="row">
                                    <Tooltip title={profile.phoneNumber}>
                                        <IconButton
                                            href={"tel:" + profile.phoneNumber}
                                        >
                                            <LocalPhoneOutlinedIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={profile.email}>
                                        <IconButton
                                            href={"mailto:" + profile.email}
                                        >
                                            <MailOutlineOutlinedIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={profile.location}>
                                        <IconButton>
                                            <LocationOnOutlinedIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            {skills.map((skill) => (
                                <Chip
                                    key={skill.id}
                                    label={skill.name}
                                    sx={{ ml: 1, mb: 1 }}
                                    color={
                                        skill.matched ? "primary" : "default"
                                    }
                                />
                            ))}
                        </Grid>
                    </Grid>
                </ListItem>
            )}
        </>
    );
}

export default CandidateListItem;
