import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";
import Alert from "@mui/material/Alert";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";

import ConfirmDialog from "../../Utils/ConfirmDialog";
import CandidateServices from "../../../services/CandidateServices";

function EducationHistoryForm(props) {
    const { loading, setLoading, educationItems, setEducationItems } = props;
    const [showDialog, setShowDialog] = useState(false);
    const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
    const degreeTypes = [
        { title: "High School Degree" },
        { title: "Associate's Degree" },
        { title: "Bachelor's Degree" },
        { title: "Master's Degree" },
        { title: "Doctorate" },
    ];

    const newItem = {
        schoolId: null,
        schoolName: "",
        degree: "",
        major: "",
        startDate: null,
        endDate: null,
        description: "",
    };

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const updatedItems = educationItems.map((item, i) => {
            return index === i ? { ...item, [name]: value } : item;
        });

        setEducationItems([...updatedItems]);
    };

    const handleAddNewEducation = () => {
        if (educationItems.length > 0) {
            const firstItem = educationItems[0];
            if (firstItem.schoolName.length > 0) {
                setEducationItems([...educationItems, { ...newItem }]);
            }
        }
    };

    const handleStartDateChange = (index, newValue) => {
        const updatedItems = educationItems.map((item, i) => {
            return index === i ? { ...item, startDate: newValue } : item;
        });
        setEducationItems([...updatedItems]);
    };

    const handleEndDateChange = (index, newValue) => {
        const updatedItems = educationItems.map((item, i) => {
            return index === i ? { ...item, endDate: newValue } : item;
        });
        setEducationItems([...updatedItems]);
    };

    const handleDegreeTypeChange = (index, newValue) => {
        const updatedItems = educationItems.map((item, i) => {
            return index === i ? { ...item, degree: newValue } : item;
        });
        setEducationItems([...updatedItems]);
    };

    const onDeleteClick = (index) => {
        setSelectedItemIndex(index);
        setShowDialog(true);
    };

    const handleDeleteEducation = () => {
        const selectedItem = educationItems[selectedItemIndex];
        if (selectedItem.schoolId) {
            // Delete item that already saved in the database
            setLoading(true);
            CandidateServices.deleteEducationHistory(
                selectedItem.schoolId
            ).then((res) => {
                setLoading(false);
                if (res) {
                    const updatedItems = educationItems.filter(
                        (item) => item.schoolId != selectedItem.schoolId
                    );
                    setEducationItems(updatedItems);
                }
            });
        } else {
            // Delete temporary item
            const updatedItems = educationItems.filter(
                (item, index) => index != selectedItemIndex
            );
            setEducationItems(updatedItems);
        }
        setShowDialog(false);
    };

    useEffect(() => {
        setLoading(true);
        CandidateServices.getEducationItems().then((response) => {
            if (response.length > 0) {
                setEducationItems([...response]);
            }
            setTimeout(() => {
                setLoading(false);
            }, 500);
        });
    }, []);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={2}>
                <Typography variant="h4" fontWeight="bold">
                    Education History
                </Typography>
                <Box
                    className={["profile-form-container", "container"].join(
                        " "
                    )}
                >
                    {educationItems.map((item, index) => (
                        <Grid container key={index} spacing={2}>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="schoolName">
                                        School
                                    </InputLabel>
                                    <TextField
                                        placeholder="Enter the school name"
                                        name="schoolName"
                                        size="small"
                                        value={item.schoolName}
                                        onChange={(e) => {
                                            handleChange(e, index);
                                        }}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="degree">
                                        Degree
                                    </InputLabel>
                                    <Autocomplete
                                        id="degree"
                                        name="degree"
                                        freeSolo
                                        options={degreeTypes.map(
                                            (degree) => degree.title
                                        )}
                                        inputValue={item.degree}
                                        onInputChange={(e, newValue) => {
                                            handleDegreeTypeChange(
                                                index,
                                                newValue
                                            );
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Your degree"
                                                name="degree"
                                                size="small"
                                            />
                                        )}
                                        disabled={loading}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="major">
                                        Major
                                    </InputLabel>
                                    <TextField
                                        placeholder="Major"
                                        name="major"
                                        size="small"
                                        value={item.major}
                                        onChange={(e) => {
                                            handleChange(e, index);
                                        }}
                                    />
                                </Stack>
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
                                                error={
                                                    item.startDate &&
                                                    item.endDate
                                                        ? item.startDate >
                                                          item.endDate
                                                        : false
                                                }
                                            />
                                        )}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="endDate">
                                        End Date (or expected)
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
                                                    item.startDate &&
                                                    item.endDate
                                                        ? item.startDate >
                                                          item.endDate
                                                        : false
                                                }
                                            />
                                        )}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Alert
                                    severity="error"
                                    sx={{
                                        display:
                                            item.endDate < item.startDate
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
                                        Remove this Education History
                                    </Button>
                                )}
                                <Divider />
                            </Grid>
                        </Grid>
                    ))}
                    {educationItems.length > 0 && (
                        <Button
                            startIcon={<AddRoundedIcon fontSize="small" />}
                            onClick={handleAddNewEducation}
                            disabled={
                                educationItems[educationItems.length - 1]
                                    .schoolName.length == 0
                            }
                        >
                            Add Another Education History
                        </Button>
                    )}
                    <div></div>
                </Box>
            </Stack>
            <ConfirmDialog
                title="Confirm"
                message="Do you want to delete this education history?"
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
                            handleDeleteEducation();
                        },
                    },
                ]}
            />
        </LocalizationProvider>
    );
}
export default EducationHistoryForm;
