import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";

import JobListView from "./JobListView";
import JobView from "./JobView";
import JobServices from "../../services/JobServices";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AppliedCandidateListView from "../Applications/AppliedCandidateListView";

/**
 * Component to display a list of jobs posted by the user
 */
function ManageJobs(props) {
    document.title = "AKKA - Manage Jobs";

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const [jobViewDialog, setJobViewDialog] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [jobs, setJobs] = useState([]);

    // Handle event when the close dialog button clicked
    const closeJobViewDialog = () => {
        setJobViewDialog(false);
    };

    // Handle event when a job is selected
    const handleJobSelected = (job) => {
        setSelectedJob(job);
        setJobViewDialog(true);
    };

    // Load all jobs posted by the user
    useEffect(() => {
        JobServices.getPostedJobs().then((response) => {
            if (response) {
                setJobs(response);
            }
        });
    }, []);

    return (
        <div>
            <Typography variant="h5" fontWeight="bold">
                Manage Jobs
            </Typography>
            <Grid container>
                <Grid item className="list-container" xs={12} sm={3}>
                    <JobListView
                        jobs={jobs}
                        onJobSelected={handleJobSelected}
                        selectedJob={selectedJob}
                    />
                </Grid>
                {!fullScreen && (
                    <Grid item xs={12} sm={6} style={{ paddingLeft: "16px" }}>
                        <div className="job-preview-container">
                            {selectedJob && <JobView job={selectedJob} />}
                        </div>
                    </Grid>
                )}
                {!fullScreen && selectedJob && (
                    <Grid item xs={12} sm={3} style={{ paddingLeft: "16px" }}>
                        <div className="list-container">
                            {selectedJob && (
                                <AppliedCandidateListView job={selectedJob} />
                            )}
                        </div>
                    </Grid>
                )}
            </Grid>
            <Dialog
                open={selectedJob !== null && jobViewDialog && fullScreen}
                fullScreen={fullScreen}
                onClose={closeJobViewDialog}
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
                        <IconButton onClick={closeJobViewDialog}>
                            <CloseRoundedIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                {selectedJob && <JobView job={selectedJob} />}
            </Dialog>
        </div>
    );
}

export default ManageJobs;
