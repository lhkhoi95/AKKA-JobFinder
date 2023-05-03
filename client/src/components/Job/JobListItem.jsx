import React from "react";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";

/**
 * A component to render a Job list item
 */
function JobListItem(props) {
    const { job, selected } = props;

    let numeral = require("numeral");

    return (
        <>
            {job && (
                <ListItem alignItems="flex-start" selected={selected}>
                    <ListItemAvatar>
                        <Avatar src={job.company.companyLogoUrl} />
                    </ListItemAvatar>
                    <Stack>
                        <Typography variant="body1" fontWeight={500}>
                            {job.title}
                        </Typography>
                        <Typography variant="body2">
                            {job.type + " - " + job.experienceLevel}
                        </Typography>
                        <Typography variant="body2">{job.location}</Typography>
                        <Typography variant="body2">
                            {numeral(job.salaryMin).format("$(0.00a)") +
                                " - " +
                                numeral(job.salaryMax).format("$(0.00a)")}
                        </Typography>
                    </Stack>
                </ListItem>
            )}
        </>
    );
}

export default JobListItem;
