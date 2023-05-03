import React from "react";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";

/**
 * A component that render each Applied Application item
 */
function ApplicationListItem(props) {
    const { item } = props;
    const getStatusColor = () => {
        switch (item.status) {
            case "Processing":
                return "warning";
            case "Accepted":
                return "success";
            case "Rejected":
                return "error";
        }
    };

    return (
        <>
            {item && (
                <Card variant="outlined">
                    <Stack alignItems="center" direction="row" sx={{ m: 1 }}>
                        <Avatar
                            src={item.companyInfo.companyLogoUrl}
                            sx={{ m: 1 }}
                        />
                        <Stack sx={{ m: 1, width: "100%" }}>
                            <Typography
                                variant="subtitle1"
                                noWrap={false}
                                fontWeight={600}
                            >
                                {item.jobInfo.title}
                            </Typography>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                            >
                                <Typography>
                                    {item.companyInfo.companyName}
                                </Typography>
                                <Chip
                                    label={item.status}
                                    size="small"
                                    color={getStatusColor()}
                                />
                            </Stack>
                        </Stack>
                    </Stack>
                </Card>
            )}
        </>
    );
}
export default ApplicationListItem;
