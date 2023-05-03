import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Alert from "@mui/material/Alert";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import moment from "moment";

import JobServices from "../../services/JobServices";
import ConfirmDialog from "../Utils/ConfirmDialog";

import { useNavigate, useParams } from "react-router-dom";
import MembershipServices from "../../services/MembershipServices";
import MembershipExpiredDialog from "../Utils/MembershipExpiredDialog";

/**
 * A component to display the Job Form
 */
function JobForm(props) {
    let navigate = useNavigate();
    let { jobId } = useParams();

    const jobTypes = [
        { title: "Full Time" },
        { title: "Part Time" },
        { title: "Intern" },
        { title: "Contract" },
    ];

    const expLevels = [
        { title: "Entry Level" },
        { title: "Junior Level" },
        { title: "Intermediate Level" },
        { title: "Senior Level" },
        { title: "Intern Level" },
    ];

    const categories = [
        { title: "Business" },
        { title: "Retail" },
        { title: "Healthcare" },
        { title: "Technology" },
        { title: "Software" },
        { title: "Manufacturing" },
        { title: "Food" },
        { title: "Finance and Insurance" },
        { title: "Banking" },
    ];

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showDialog, setShowDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [description, setDescription] = useState("");
    const [membershipExpired, setMembershipExpired] = useState(true);

    let undefinedJob = {
        job_id: undefined,
        title: "",
        type: "",
        experienceLevel: "",
        location: "",
        category: "",
        salaryMin: "",
        salaryMax: "",
        description: "",
        company: {
            name: "",
            size: "",
            industryField: "",
        },
        startDate: null,
        endDate: null,
        applications: [],
    };

    const [job, setJob] = useState({
        ...undefinedJob,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJob({
            ...job,
            [name]: value,
        });
    };

    /**
     * Handle event when the form is submitted
     * @param {*} e
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setShowDialog(false);
        if (validate()) {
            try {
                console.log(job);
                const response = await JobServices.saveJob({
                    ...job,
                    description: description,
                });
                setMessage(response);
                setShowDialog(true);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    /**
     * Validate the salary range and date range
     * @returns true if the range pairs are valid
     */
    const validate = () => {
        if (job.salaryMin !== "" && job.salaryMax !== "") {
            if (parseInt(job.salaryMin) >= parseInt(job.salaryMax)) {
                setErrorMessage("Min. salary must be greater than Max. Salary");
                return false;
            }
        }

        if (job.startDate > job.endDate) {
            console.log(job.startDate > job.endDate);
            setErrorMessage(
                "The available start date must be smaller the end date."
            );
            return false;
        }

        setErrorMessage("");
        return true;
    };

    /**
     * Load a job information by a specified job id
     * @param {*} jobId
     */
    const loadJob = async (jobId) => {
        setLoading(true);
        try {
            const job = await JobServices.getJob(jobId);
            setJob({
                ...job,
                startDate: moment(job.startDate, "YYYY-MM-DD"),
                endDate: moment(job.endDate, "YYYY-MM-DD"),
            });
            setDescription(job.description);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Load the membership status of the current user
     */
    const loadMembership = () => {
        MembershipServices.isMembershipExpired().then((response) => {
            setMembershipExpired(response);
        });
    };

    // on Component Mounted
    useEffect(() => {
        document.title = "Post Job";
        if (jobId) {
            loadJob(jobId.split(":")[1]);
            document.title = "Edit Job";
        }
        loadMembership();
    }, []);

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack>
                    <Typography variant="h4">
                        {job.id ? "Edit Job" : "Post Job"}
                    </Typography>
                    <div
                        className="list-container profile-form-container"
                        style={{ marginTop: "16px" }}
                        component="form"
                    >
                        <Grid
                            container
                            spacing={2}
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{ p: 2 }}
                        >
                            <Grid item xs={12}></Grid>
                            <Grid item xs={12}>
                                <InputLabel htmlFor="title" required>
                                    Title
                                </InputLabel>
                                <TextField
                                    id="title"
                                    name="title"
                                    size="small"
                                    placeholder="Job title"
                                    value={job.title}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    disabled={loading || membershipExpired}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <InputLabel id="type" htmlFor="type" required>
                                    Job Type
                                </InputLabel>
                                <Select
                                    id="type"
                                    labelId="type"
                                    name="type"
                                    size="small"
                                    value={job.type}
                                    fullWidth
                                    onChange={handleChange}
                                    required
                                    disabled={loading || membershipExpired}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {jobTypes.map((type) => (
                                        <MenuItem
                                            key={type.title}
                                            value={type.title}
                                        >
                                            {type.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid item xs={6}>
                                <InputLabel id="experienceLevel" required>
                                    Experience Level
                                </InputLabel>
                                <Select
                                    labelId="experienceLevel"
                                    id="experienceLevel"
                                    name="experienceLevel"
                                    size="small"
                                    fullWidth
                                    value={job.experienceLevel}
                                    onChange={handleChange}
                                    required
                                    disabled={loading || membershipExpired}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {expLevels.map((level) => (
                                        <MenuItem
                                            key={level.title}
                                            value={level.title}
                                        >
                                            {level.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid item xs={6}>
                                <InputLabel htmlFor="location" required>
                                    Location
                                </InputLabel>
                                <Autocomplete
                                    id="location"
                                    name="location"
                                    freeSolo
                                    options={["Remote"]}
                                    inputValue={job.location}
                                    onInputChange={(e, newValue) => {
                                        setJob({
                                            ...job,
                                            location: newValue,
                                        });
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            name="location"
                                            size="small"
                                            placeholder="Job location"
                                            required
                                        />
                                    )}
                                    disabled={loading || membershipExpired}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <InputLabel htmlFor="category">
                                    Job Category
                                </InputLabel>
                                <Autocomplete
                                    id="category"
                                    name="category"
                                    freeSolo
                                    options={categories.map(
                                        (category) => category.title
                                    )}
                                    inputValue={job.category}
                                    onInputChange={(e, newValue) => {
                                        setJob({
                                            ...job,
                                            category: newValue,
                                        });
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            size="small"
                                            name="category"
                                            placeholder="Job category"
                                        />
                                    )}
                                    disabled={loading || membershipExpired}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <InputLabel htmlFor="salaryMin">
                                    Min Salary
                                </InputLabel>
                                <TextField
                                    id="salaryMin"
                                    name="salaryMin"
                                    size="small"
                                    type="number"
                                    placeholder="Min salary"
                                    value={job.salaryMin}
                                    onChange={handleChange}
                                    error={
                                        job.salaryMin !== "" &&
                                        job.salaryMax !== ""
                                            ? parseInt(job.salaryMin) >=
                                              parseInt(job.salaryMax)
                                            : false
                                    }
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                $
                                            </InputAdornment>
                                        ),
                                    }}
                                    disabled={loading || membershipExpired}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <InputLabel htmlFor="maxSalary">
                                    Max Salary
                                </InputLabel>
                                <TextField
                                    id="salaryMax"
                                    name="salaryMax"
                                    size="small"
                                    placeholder="Max salary"
                                    type="number"
                                    value={job.salaryMax}
                                    onChange={handleChange}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                $
                                            </InputAdornment>
                                        ),
                                    }}
                                    disabled={loading || membershipExpired}
                                    error={
                                        job.salaryMin !== "" &&
                                        job.salaryMax !== ""
                                            ? parseInt(job.salaryMin) >=
                                              parseInt(job.salaryMax)
                                            : false
                                    }
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <InputLabel htmlFor="startDate" required>
                                    Available for Applying From
                                </InputLabel>
                                <DatePicker
                                    value={job.startDate}
                                    onChange={(newValue) => {
                                        setJob({
                                            ...job,
                                            startDate: newValue,
                                        });
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            id="startDate"
                                            name="startDate"
                                            size="small"
                                            fullWidth
                                            required
                                            error={
                                                job.startDate && job.endDate
                                                    ? job.startDate >=
                                                      job.endDate
                                                    : false
                                            }
                                        />
                                    )}
                                    disabled={loading || membershipExpired}
                                    disablePast
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <InputLabel htmlFor="endDate" required>
                                    To
                                </InputLabel>
                                <DatePicker
                                    value={job.endDate}
                                    onChange={(newValue) => {
                                        setJob({
                                            ...job,
                                            endDate: newValue,
                                        });
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            id="endDate"
                                            name="endDate"
                                            size="small"
                                            fullWidth
                                            required
                                            error={
                                                job.startDate && job.endDate
                                                    ? job.startDate >=
                                                      job.endDate
                                                    : false
                                            }
                                        />
                                    )}
                                    disabled={loading || membershipExpired}
                                    disablePast
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel htmlFor="description">
                                    Description
                                </InputLabel>
                                <ReactQuill
                                    theme="snow"
                                    value={description}
                                    onChange={(content) => {
                                        setDescription(content);
                                    }}
                                    readOnly={loading || membershipExpired}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Alert
                                    severity="error"
                                    sx={{
                                        display:
                                            errorMessage.length > 0
                                                ? "flex"
                                                : "none",
                                    }}
                                >
                                    {errorMessage}
                                </Alert>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    justifyContent="space-between"
                                >
                                    {job && jobId && (
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => {
                                                setShowDeleteDialog(true);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    )}
                                    <Stack direction="row" spacing={2}>
                                        <Button
                                            variant="contained"
                                            disableElevation
                                            type="submit"
                                            disabled={
                                                loading || membershipExpired
                                            }
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            disableElevation
                                            disabled={
                                                loading || membershipExpired
                                            }
                                            onClick={() => {
                                                navigate(-1);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Grid>
                            <Grid item></Grid>
                        </Grid>
                    </div>
                </Stack>
            </LocalizationProvider>
            <ConfirmDialog
                title="Message"
                message={message}
                showDialog={showDialog}
                actions={[
                    {
                        title: "Close",
                        primary: true,
                        color: "primary",
                        action: () => {
                            if (!job.job_id) {
                                navigate("/recruiter/manage-jobs");
                            }
                        },
                    },
                ]}
            />
            <ConfirmDialog
                title="Confirm"
                message="Do you want to delete this job posting?"
                showDialog={showDeleteDialog}
                actions={[
                    {
                        title: "Close",
                        primary: false,
                        color: "primary",
                        action: () => {
                            setShowDeleteDialog(false);
                        },
                    },
                    {
                        title: "Delete",
                        primary: true,
                        color: "error",
                        action: () => {
                            JobServices.deleteJob(jobId.split(":")[1]).then(
                                (response) => {
                                    setShowDeleteDialog(false);
                                    setJob({ ...job, job_id: undefined });
                                    setMessage(response);
                                    setShowDialog(true);
                                }
                            );
                        },
                    },
                ]}
            />
            {membershipExpired && <MembershipExpiredDialog />}
        </>
    );
}

export default JobForm;
