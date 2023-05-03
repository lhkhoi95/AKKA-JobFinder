import React from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";

import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import UpdateEmailForm from "./UpdateEmailForm";
import UpdatePasswordForm from "./UpdatePasswordForm";
import DeleteAccountForm from "./DeleteAccountForm";

/**
 * A component to display the user Settings page
 */
function Settings(props) {
    document.title = "Settings";
    const options = [
        {
            title: "Update Email Address",
            icon: <EmailRoundedIcon color="primary" />,
            content: <UpdateEmailForm />,
            expanded: true,
        },
        {
            title: "Update Password",
            icon: <LockRoundedIcon color="primary" />,
            content: <UpdatePasswordForm />,
            expanded: false,
        },
        {
            title: "Delete Account",
            icon: <DeleteRoundedIcon color="primary" />,
            content: <DeleteAccountForm />,
            expanded: false,
        },
    ];
    return (
        <Stack {...props} spacing={2}>
            <Typography variant="h4" fontWeight="bold">
                Settings
            </Typography>
            {options.map((item, index) => (
                <div key={index}>
                    <Accordion
                        disableGutters
                        square
                        defaultExpanded={item.expanded}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreRoundedIcon />}
                        >
                            <Stack direction="row" spacing={2}>
                                {item.icon}
                                <Typography fontWeight="bold">
                                    {item.title}
                                </Typography>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>{item.content}</AccordionDetails>
                    </Accordion>
                </div>
            ))}
        </Stack>
    );
}

export default Settings;
