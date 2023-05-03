import React, { useState, useEffect } from "react";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Alert from "@mui/material/Alert";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CandidateServices from "../../../services/CandidateServices";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";

import ConfirmDialog from "../../Utils/ConfirmDialog";

function SkillsExperienceForm(props) {
    const {
        skills,
        setSkills,
        experienceItems,
        setExperienceItems,
        loading,
        setLoading,
    } = props;

    const newItem = {
        id: null,
        position: "",
        companyName: "",
        startDate: null,
        endDate: null,
        currentJob: false,
        description: "",
        location: "",
    };

    const [showDialog, setShowDialog] = useState(false);
    const [skillValue, setSkillValue] = useState("");
    const [selectedItemIndex, setSelectedItemIndex] = useState(-1);

    const handleAddSkill = (e) => {
        const { value } = e.target;
        if (e.key.toLowerCase() === "enter") {
            setLoading(true);
            CandidateServices.addSkill(value).then((response) => {
                setSkills([...skills, response]);
                setLoading(false);
                setSkillValue("");
            });
        }
    };

    const handleAddSkillButtonClick = (e) => {
        e.preventDefault();
        setLoading(true);
        CandidateServices.addSkill(skillValue).then((response) => {
            setSkills([...skills, response]);
            setLoading(false);
            setSkillValue("");
        });
    };

    const handleChange = (e, index) => {
        const { name, value } = e.target;

        if (name === "currentJob") {
            const updatedItems = experienceItems.map((item, i) => {
                return index === i
                    ? {
                          ...item,
                          currentJob: value,
                          endDate: value ? null : item.endDate,
                      }
                    : item;
            });
            setExperienceItems([...updatedItems]);
        } else {
            const updatedItems = experienceItems.map((item, i) => {
                return index === i ? { ...item, [name]: value } : item;
            });
            setExperienceItems([...updatedItems]);
        }
    };

    const handleDeleteSkill = (skillId) => {
        setLoading(true);
        CandidateServices.deleteSkill(skillId).then((response) => {
            if (response) {
                setLoading(false);
                const updatedSkills = skills.filter(
                    (skill) => skill.id !== skillId
                );
                setSkills(updatedSkills);
            }
        });
    };

    const handleAddNewExperience = () => {
        setExperienceItems([...experienceItems, { ...newItem }]);
    };

    const handleStartDateChange = (index, newValue) => {
        const updatedItems = experienceItems.map((item, i) => {
            return index === i ? { ...item, startDate: newValue } : item;
        });
        setExperienceItems([...updatedItems]);
    };

    const handleEndDateChange = (index, newValue) => {
        const updatedItems = experienceItems.map((item, i) => {
            return index === i ? { ...item, endDate: newValue } : item;
        });
        setExperienceItems([...updatedItems]);
    };

    const onDeleteClick = (index) => {
        setSelectedItemIndex(index);
        setShowDialog(true);
    };

    const handleDeleteExperienceItem = () => {
        const selectedItem = experienceItems[selectedItemIndex];
        if (selectedItem.id) {
            // Delete item that already saved in the database
            setLoading(true);
            CandidateServices.deleteWorkHistory(selectedItem.id).then((res) => {
                setLoading(false);
                if (res) {
                    const updatedItems = experienceItems.filter(
                        (item) => item.id != selectedItem.id
                    );
                    setExperienceItems(updatedItems);
                }
            });
        } else {
            // Delete temporary item
            const updatedItems = experienceItems.filter(
                (item, index) => index != selectedItemIndex
            );
            setExperienceItems(updatedItems);
        }
        setShowDialog(false);
    };

    const loadData = async () => {
        setLoading(true);
        const [skillsRes, expRes] = await Promise.all([
            CandidateServices.getSkills(),
            CandidateServices.getWorkHistoryItems(),
        ]);
        if (skillsRes && expRes) {
            setSkills([...skillsRes]);
            if (expRes.length > 0) {
                setExperienceItems([...expRes]);
            }
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {}, [experienceItems]);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={2}>
                <Typography variant="h4" fontWeight="bold">
                    Skills
                </Typography>
                <Box
                    className={["profile-form-container", "container"].join(
                        " "
                    )}
                >
                    <div></div>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                placeholder="What are your skills? Press enter after each skill."
                                size="small"
                                fullWidth
                                onKeyDown={handleAddSkill}
                                value={skillValue}
                                onChange={(e) => {
                                    const { value } = e.target;
                                    setSkillValue(value);
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <Button
                                            onClick={handleAddSkillButtonClick}
                                        >
                                            Add
                                        </Button>
                                    ),
                                }}
                                disabled={loading}
                            />
                        </Grid>
                        {skills.map((skill) => (
                            <Grid item key={skill.id}>
                                <Chip
                                    label={skill.name}
                                    color="primary"
                                    onDelete={() => {
                                        handleDeleteSkill(skill.id);
                                    }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                    Work & Experience
                </Typography>
                <Box
                    className={["profile-form-container", "container"].join(
                        " "
                    )}
                >
                    {experienceItems.map((item, index) => (
                        <Grid container spacing={2} key={index}>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="position">
                                        Title
                                    </InputLabel>
                                    <TextField
                                        placeholder="Your position/title"
                                        name="position"
                                        size="small"
                                        value={item.position}
                                        onChange={(e) => {
                                            handleChange(e, index);
                                        }}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="companyName">
                                        Company Name
                                    </InputLabel>
                                    <TextField
                                        placeholder="Enter the company name"
                                        name="companyName"
                                        size="small"
                                        value={item.companyName}
                                        onChange={(e) => {
                                            handleChange(e, index);
                                        }}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="location">
                                        Location
                                    </InputLabel>
                                    <TextField
                                        placeholder="Company Location"
                                        name="location"
                                        size="small"
                                        value={item.location}
                                        onChange={(e) => {
                                            handleChange(e, index);
                                        }}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={item.currentJob}
                                            name="currentJob"
                                            onChange={(e) => {
                                                const event = {
                                                    target: {
                                                        name: e.target.name,
                                                        value: e.target.checked,
                                                    },
                                                };
                                                handleChange(event, index);
                                            }}
                                        />
                                    }
                                    label="Currently work here"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="startDate">
                                        Start Date
                                    </InputLabel>
                                    <DatePicker
                                        views={["month", "year"]}
                                        inputFormat="MM/yyyy"
                                        name="startDate"
                                        value={item.startDate}
                                        onChange={(newValue) => {
                                            handleStartDateChange(
                                                index,
                                                newValue
                                            );
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="MM/YYYY"
                                                name="startDate"
                                                size="small"
                                                value={item.startDate}
                                                onChange={(e) => {
                                                    handleChange(e, index);
                                                }}
                                            />
                                        )}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="endDate">
                                        End Date
                                    </InputLabel>
                                    <DatePicker
                                        views={["month", "year"]}
                                        inputFormat="MM/yyyy"
                                        name="endDate"
                                        value={item.endDate}
                                        onChange={(newValue) => {
                                            handleEndDateChange(
                                                index,
                                                newValue
                                            );
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="MM/YYYY"
                                                name="endDate"
                                                size="small"
                                                value={item.endDate}
                                                onChange={(e) => {
                                                    handleChange(e, index);
                                                }}
                                                error={
                                                    !item.currentJob &&
                                                    item.startDate &&
                                                    item.endDate &&
                                                    item.startDate >
                                                        item.endDate
                                                }
                                            />
                                        )}
                                        disabled={item.currentJob}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Alert
                                    severity="error"
                                    sx={{
                                        display:
                                            !item.currentJob &&
                                            item.startDate &&
                                            item.endDate &&
                                            item.startDate > item.endDate
                                                ? "flex"
                                                : "none",
                                    }}
                                >
                                    Start Date must be less than End Date
                                </Alert>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="description">
                                        Description
                                    </InputLabel>
                                    <TextField
                                        name="description"
                                        multiline
                                        minRows={2}
                                        value={item.description}
                                        onChange={(e) => {
                                            handleChange(e, index);
                                        }}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} textAlign="right">
                                {index !== 0 && (
                                    <Button
                                        startIcon={
                                            <RemoveRoundedIcon fontSize="small" />
                                        }
                                        onClick={() => {
                                            onDeleteClick(index);
                                        }}
                                    >
                                        Remove this Work & Experience History
                                    </Button>
                                )}
                                <Divider />
                            </Grid>
                        </Grid>
                    ))}
                    {experienceItems.length > 0 && (
                        <Button
                            onClick={handleAddNewExperience}
                            startIcon={<AddRoundedIcon fontSize="small" />}
                            disabled={
                                experienceItems[experienceItems.length - 1]
                                    .companyName.length == 0 &&
                                experienceItems[experienceItems.length - 1]
                                    .position.length == 0
                            }
                        >
                            Add Another Work/Experience
                        </Button>
                    )}
                    <div></div>
                </Box>
            </Stack>
            <ConfirmDialog
                title="Confirm"
                message="Do you want to delete this work/experience history?"
                showDialog={showDialog}
                actions={[
                    {
                        title: "Close",
                        primary: false,
                        color: "primary",
                        action: () => {
                            setShowDialog(false);
                        },
                    },
                    {
                        title: "Delete",
                        primary: true,
                        color: "error",
                        action: () => {
                            handleDeleteExperienceItem();
                        },
                    },
                ]}
            />
        </LocalizationProvider>
    );
}
export default SkillsExperienceForm;
