import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Pagination from "@mui/material/Pagination";
import Avatar from "@mui/material/Avatar";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import ApplicationServices from "../../services/ApplicationServices";
import ApplicationListItem from "./ApplicationListItem";

import JobView from "../Job/JobView";

/**
 * A component that display the View Applied Application list.
 */
function ApplicationList(props) {
    const pageSize = 5;
    const [jobs, setJobs] = useState([]);
    const [statuses, setStatuses] = useState([
        { title: "Processing", selected: true },
        { title: "Pending", selected: true },
        { title: "Accepted", selected: true },
        { title: "Rejected", selected: false },
    ]);
    const [displayedJobs, setDisplayedJobs] = useState([]);
    const [pages, setPages] = useState(1);
    const [currPageIndex, setCurrPageIndex] = useState(1);
    const [showDialog, setShowDialog] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    /**
     * On component mounted
     * Load all applications that were applied by the current user
     */
    useEffect(() => {
        ApplicationServices.getApplications().then((res) => {
            setJobs(res);
            setDisplayedJobs(res);
            renderList(res);
        });
    }, []);

    /**
     * Render the list when the status options or page index changed
     */
    useEffect(() => {
        renderList(jobs);
    }, [statuses, currPageIndex]);

    // Handle event when a Status filter option clicked
    const handleStatusFilterClick = (status) => {
        const updatedItems = statuses.map((item) => {
            return status.title === item.title
                ? { ...status, selected: !status.selected }
                : item;
        });
        setStatuses(updatedItems);
    };

    // Handle event when the current page index changed
    const handlePageIndexChange = (event, value) => {
        setCurrPageIndex(value);
    };

    /**
     * Method to render the list
     * filter the items based on selected application statuses
     * then apply paging
     */
    const renderList = (items) => {
        const selectedStatuses = statuses
            .filter((status) => status.selected)
            .map((status) => status.title);
        const filteredItems = items.filter((item) =>
            selectedStatuses.includes(item.status)
        );

        setPages(Math.ceil(filteredItems.length / pageSize));

        let fromIndex = (currPageIndex - 1) * pageSize;
        let toIndex = currPageIndex * pageSize;
        setDisplayedJobs(filteredItems.slice(fromIndex, toIndex));
    };

    // Handle event when the Close button clicked
    const handleCloseDialog = () => {
        setShowDialog(false);
        setSelectedJob(null);
    };

    return (
        <Stack {...props} spacing={1}>
            <Typography variant="h4" fontWeight="bold">
                Your Applied Jobs
            </Typography>
            <Typography variant="subtitle1">
                Select the following chips to filter your list
            </Typography>
            <Grid container spacing={1}>
                {statuses.map((status) => (
                    <Grid item key={status.title}>
                        <FormControlLabel
                            control={<Checkbox checked={status.selected} />}
                            label={status.title}
                            onChange={() => {
                                handleStatusFilterClick(status);
                            }}
                        />
                    </Grid>
                ))}
            </Grid>
            <Stack spacing={2}>
                {displayedJobs.map((job) => (
                    <Box
                        key={job.id}
                        onClick={() => {
                            setSelectedJob({
                                ...job.jobInfo,
                                company: job.companyInfo,
                            });
                            setShowDialog(true);
                        }}
                    >
                        <ApplicationListItem item={job} />
                    </Box>
                ))}
                {jobs.length !== 0 && displayedJobs.length === 0 && (
                    <Stack alignItems="center">
                        <Avatar variant="rounded">
                            <SearchOutlinedIcon />
                        </Avatar>
                        <Typography variant="h6">
                            Sorry, we couldn't find any matches your queries.
                        </Typography>
                        <Typography>
                            Please try again with other options.
                        </Typography>
                    </Stack>
                )}
                {jobs.length === 0 && (
                    <Stack alignItems="center">
                        <Avatar variant="rounded">
                            <SearchOutlinedIcon />
                        </Avatar>
                        <Typography variant="h6">
                            You have no applied jobs available.
                        </Typography>
                    </Stack>
                )}
            </Stack>
            {displayedJobs.length !== 0 && (
                <Stack
                    alignItems="center"
                    sx={{
                        paddingTop: "16px",
                        paddingBottom: "16px",
                    }}
                >
                    <Pagination
                        count={pages}
                        color="primary"
                        page={currPageIndex}
                        onChange={handlePageIndexChange}
                    />
                </Stack>
            )}
            <Dialog
                open={showDialog}
                fullWidth
                maxWidth="lg"
                sx={{ backdropFilter: "blur(5px)" }}
            >
                <AppBar
                    color="inherit"
                    sx={{ position: "relative" }}
                    className="menu-bar"
                    elevation={0}
                >
                    <Toolbar>
                        <Typography
                            sx={{ flex: 1 }}
                            variant="h6"
                            component="div"
                        >
                            Job View
                        </Typography>
                        <IconButton onClick={handleCloseDialog}>
                            <CloseRoundedIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <JobView job={selectedJob} />
                </DialogContent>
            </Dialog>
        </Stack>
    );
}

export default ApplicationList;
