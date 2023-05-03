import React, { useEffect, useState } from "react";

import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Slider from "@mui/material/Slider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Avatar from "@mui/material/Avatar";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import JobServices from "../../services/JobServices";
import JobListView from "./JobListView";
import JobView from "./JobView";
import SearchServices from "../../services/SearchServices";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

/**
 * A component to display the Job Search page.
 */
function JobSearchForm(props) {
    document.title = "AKKA - Search Jobs";

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const [openDialog, setOpenDialog] = useState(false);
    const [jobViewDialog, setJobViewDialog] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [filterOptions, setFilterOptions] = useState({
        types: [
            { title: "Full Time", checked: true },
            { title: "Part Time", checked: true },
            { title: "Intern", checked: true },
            { title: "Contract", checked: true },
        ],
        experienceLevels: [
            { title: "Entry Level", checked: true },
            { title: "Junior Level", checked: true },
            { title: "Intermediate Level", checked: true },
            { title: "Senior Level", checked: true },
            { title: "Intern Level", checked: true },
        ],
        salaryRange: [0, 500000],
    });

    // Handle event when the close dialog button clicked
    const closeJobViewDialog = () => {
        setJobViewDialog(false);
    };

    // Handle event when a job item is selected
    const handleJobSelected = (job) => {
        setSelectedJob(job);
        setJobViewDialog(true);
    };

    // Search the jobs by the queries
    const handleSearch = (title, location) => {
        SearchServices.searchJobs(title, location).then((response) => {
            setJobs(response);
            filterJobs(response);
        });
    };

    // Handle event when the Filter button clicked
    const applyFilter = () => {
        filterJobs(jobs);
    };

    // Filter the job list
    const filterJobs = (items) => {
        const selectedTypes = filterOptions.types
            .filter((option) => option.checked)
            .map((option) => {
                return option.title;
            });

        const selectedLevels = filterOptions.experienceLevels
            .filter((option) => option.checked)
            .map((option) => {
                return option.title;
            });

        const filteredItems = items
            .filter((job) => selectedTypes.includes(job.type))
            .filter((job) => selectedLevels.includes(job.experienceLevel))
            .filter(
                (job) =>
                    parseInt(job.salaryMin) >= filterOptions.salaryRange[0] &&
                    parseInt(job.salaryMax) <= filterOptions.salaryRange[1]
            );

        setFilteredJobs(filteredItems);
        setOpenDialog(false);
    };

    /**
     * On component mounted.
     * Load all jobs and populate to the job list.
     */
    useEffect(() => {
        JobServices.getJobs().then((response) => {
            if (response) {
                setJobs(response);
                filterJobs(response);
            }
        });
    }, []);

    // A component to display no search results
    const NoSearchResults = () => {
        return (
            <Stack
                className="list-container"
                sx={{ p: 2, minHeight: "50vh" }}
                alignItems="center"
                justifyContent="center"
            >
                <Avatar variant="rounded">
                    <SearchOutlinedIcon />
                </Avatar>
                <Typography variant="h6">
                    Sorry, we couldn't find any matches your queries.
                </Typography>
                <Typography>Please try again with other queries.</Typography>
            </Stack>
        );
    };

    return (
        <Stack spacing={2}>
            <SearchBar
                setOpenDialog={setOpenDialog}
                handleSearch={handleSearch}
            />
            <FilterDialog
                open={openDialog}
                setOpen={setOpenDialog}
                filterOptions={filterOptions}
                setFilterOptions={setFilterOptions}
                onApplyFilterClick={applyFilter}
            />
            {jobs.length == 0 && <NoSearchResults />}
            {jobs.length > 0 && (
                <Grid container>
                    <Grid item className="list-container" xs={12} md={4}>
                        <JobListView
                            jobs={filteredJobs}
                            onJobSelected={handleJobSelected}
                            selectedJob={selectedJob}
                        />
                    </Grid>
                    {!fullScreen && (
                        <Grid
                            item
                            xs={12}
                            md={8}
                            style={{ paddingLeft: "20px" }}
                        >
                            <div className="job-preview-container">
                                {selectedJob && <JobView job={selectedJob} />}
                            </div>
                        </Grid>
                    )}
                </Grid>
            )}
            <Dialog
                open={
                    selectedJob !== null &&
                    jobViewDialog &&
                    fullScreen &&
                    !openDialog
                }
                fullScreen={fullScreen}
                onClose={closeJobViewDialog}
                style={{ backgroundColor: "#fff" }}
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
        </Stack>
    );
}

// A component display the Search Bar
function SearchBar(props) {
    const { setOpenDialog, handleSearch } = props;
    const [queries, setQueries] = useState({
        jobTitle: "",
        location: "",
    });

    const handleOpenFilters = () => {
        setOpenDialog(true);
    };

    const handleSearchBtnClick = (e) => {
        e.preventDefault();
        handleSearch(queries.jobTitle, queries.location);
    };

    const handleKeyDown = (e) => {
        if (e.key.toLowerCase() === "enter") {
            handleSearch(queries.jobTitle, queries.location);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setQueries({
            ...queries,
            [name]: value,
        });
    };
    return (
        <Grid
            container
            direction="row"
            className="search-bar-container"
            justifyContent="space-between"
            alignItems="center"
        >
            <Grid item xs={4}>
                <Input
                    name="jobTitle"
                    value={queries.jobTitle}
                    disableUnderline
                    fullWidth
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Job title"
                    startAdornment={
                        <SearchRoundedIcon
                            color="disabled"
                            sx={{ mr: "10px" }}
                        />
                    }
                />
            </Grid>
            <Grid item xs={4}>
                <Input
                    name="location"
                    value={queries.location}
                    disableUnderline
                    fullWidth
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Location"
                    startAdornment={
                        <LocationOnOutlinedIcon
                            color="disabled"
                            sx={{ mr: "10px" }}
                        />
                    }
                />
            </Grid>
            <Grid item xs={3} sm={2} md={2}>
                <Stack direction="row" justifyContent="flex-end">
                    <IconButton onClick={handleOpenFilters}>
                        <TuneRoundedIcon />
                    </IconButton>
                    <Button
                        variant="contained"
                        disableElevation
                        onClick={handleSearchBtnClick}
                    >
                        Search
                    </Button>
                </Stack>
            </Grid>
        </Grid>
    );
}

// A component to display the Filter Dialog
function FilterDialog(props) {
    let numeral = require("numeral");

    const {
        open,
        setOpen,
        filterOptions,
        setFilterOptions,
        onApplyFilterClick,
    } = props;
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const [value, setValue] = React.useState([0, 120000]);

    const types = [
        { title: "Full Time", checked: false },
        { title: "Part Time", checked: false },
        { title: "Intern", checked: false },
        { title: "Contract", checked: false },
    ];

    const experienceLevels = [
        { title: "Entry Level", checked: false },
        { title: "Junior Level", checked: false },
        { title: "Intermediate Level", checked: false },
        { title: "Senior Level", checked: false },
        { title: "Intern Level", checked: false },
    ];

    const handleClose = () => {
        setOpen(false);
    };

    const handleSalaryRangeChange = (event, newValue) => {
        setFilterOptions({
            ...filterOptions,
            salaryRange: newValue,
        });
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullScreen={fullScreen}
            maxWidth="md"
            sx={{ backdropFilter: "blur(5px)" }}
        >
            <DialogTitle>Search Filters</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FilterGroup
                            title="Employment Types"
                            options={filterOptions.types}
                            filterOptions={filterOptions}
                            setFilterOptions={setFilterOptions}
                            groupName="employmentTypes"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FilterGroup
                            title="Experience Levels"
                            options={filterOptions.experienceLevels}
                            filterOptions={filterOptions}
                            setFilterOptions={setFilterOptions}
                            groupName="experienceLevels"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>Salary Range</Typography>

                        <Stack direction="row" spacing={2} alignItems="center">
                            <Typography>
                                {numeral(filterOptions.salaryRange[0]).format(
                                    "($0.00a)"
                                )}
                            </Typography>
                            <Slider
                                value={filterOptions.salaryRange}
                                onChange={handleSalaryRangeChange}
                                valueLabelDisplay="auto"
                                max={500000}
                                min={0}
                                step={10000}
                                valueLabelFormat={(x) =>
                                    numeral(x).format("($0.00a)")
                                }
                            />
                            <Typography>
                                {numeral(filterOptions.salaryRange[1]).format(
                                    "($0.00a)"
                                )}
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
                <Button onClick={handleClose}>Clear</Button>
                <Button onClick={onApplyFilterClick}>Apply</Button>
            </DialogActions>
        </Dialog>
    );
}

// A component to render a group of filter options
function FilterGroup(props) {
    const { title, options, filterOptions, setFilterOptions, groupName } =
        props;

    const handleChange = (e, newValue) => {
        const { name } = e.target;

        if (groupName === "employmentTypes") {
            const updatedEmploymentTypes = filterOptions.types.map((option) => {
                return option.title === name
                    ? { ...option, checked: newValue }
                    : option;
            });
            setFilterOptions({
                ...filterOptions,
                types: updatedEmploymentTypes,
            });
        }

        if (groupName === "experienceLevels") {
            const updatedExperienceLevels = filterOptions.experienceLevels.map(
                (option) => {
                    return option.title === name
                        ? { ...option, checked: newValue }
                        : option;
                }
            );
            setFilterOptions({
                ...filterOptions,
                experienceLevels: updatedExperienceLevels,
            });
        }
    };

    return (
        <Stack>
            <Typography>{title}</Typography>
            <Grid container>
                {options.map((option, index) => (
                    <Grid item key={index} xs={4} sm={3}>
                        <FormControlLabel
                            name={option.title}
                            control={<Checkbox checked={option.checked} />}
                            label={option.title}
                            onChange={handleChange}
                        />
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
}

export default JobSearchForm;
