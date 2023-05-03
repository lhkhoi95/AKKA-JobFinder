import React, { useState, useEffect, useRef } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";

import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import FileHandlingServices from "../../../services/FileHandlingServices";
import RecruiterServices from "../../../services/RecruiterServices";
import AuthenticationServices from "../../../services/AuthenticationServices";
import ConfirmDialog from "../../Utils/ConfirmDialog";

// A component to display the Custom Company Profile Form
function CompanyProfileForm(props) {
    const [showDialog, setShowDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({
        name: "",
        size: "",
        industry: "",
        companyLogoUrl: "",
    });

    const fileInput = useRef();

    // Handle event when a text field value changed
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({
            ...profile,
            [name]: value,
        });
    };

    // Handle event when a file selected
    const handleFileInput = (e) => {
        if (e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
            uploadImage(e.target.files[0]);
        }
    };

    // Upload image to server
    const uploadImage = async (imageFile) => {
        const response = await FileHandlingServices.uploadImage(imageFile);
        setLoading(true);
        if (response !== "") {
            setLoading(false);
            setProfileImageUrl(response);
        }
    };

    // Handle event when the form submitted
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        const companyProfile = {
            company_name: profile.name,
            company_size: profile.size,
            industry: profile.industry,
            company_logo_url: profileImageUrl,
        };

        try {
            RecruiterServices.updateCompanyProfile(companyProfile).then(
                (response) => {
                    setLoading(false);
                    setShowDialog(true);
                }
            );
        } catch (e) {
            console.error(e);
        }
    };

    /**
     * On component mounted
     * Load company profile from the server
     */
    useEffect(() => {
        document.title = "AKKA - Edit Company Profile";
        AuthenticationServices.getProfile("recruiter").then((response) => {
            console.log(response);
            if (response.status === 200) {
                const { data } = response;
                setProfile({
                    name: data.companyName,
                    size: data.companySize,
                    industry: data.industry,
                    companyLogoUrl: data.companyLogoUrl,
                });
                setProfileImageUrl(data.companyLogoUrl);
            }
        });
    }, []);

    return (
        <Container maxWidth="md" disableGutters>
            <div>
                <Stack>
                    <Typography variant="h5" fontWeight="bold">
                        Edit Company Profile
                    </Typography>
                    <div
                        className="list-container profile-form-container"
                        style={{ marginTop: "16px" }}
                    >
                        <Grid
                            container
                            alignItems="center"
                            spacing={2}
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{ p: 2 }}
                        >
                            <Grid item xs={12} sm={3}>
                                <InputLabel htmlFor="name">
                                    Company Icon
                                </InputLabel>
                            </Grid>
                            <Grid item xs={12} sm={9}>
                                <IconButton
                                    size="large"
                                    color="primary"
                                    onClick={() => fileInput.current.click()}
                                    disabled={loading}
                                >
                                    <input
                                        ref={fileInput}
                                        type="file"
                                        style={{ display: "none" }}
                                        onChange={handleFileInput}
                                        accept="image/*"
                                    />
                                    {selectedFile || profileImageUrl ? (
                                        <Avatar
                                            src={profileImageUrl}
                                            sx={{ width: 50, height: 50 }}
                                        />
                                    ) : (
                                        <AddPhotoAlternateRoundedIcon fontSize="large" />
                                    )}
                                </IconButton>
                                <div>
                                    <Typography variant="caption">
                                        Click on the icon above to change
                                        profile picture
                                    </Typography>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <InputLabel htmlFor="name">
                                    Company Name
                                </InputLabel>
                            </Grid>
                            <Grid item xs={12} sm={9}>
                                <TextField
                                    id="name"
                                    name="name"
                                    placeholder="The name of your company"
                                    size="small"
                                    value={profile.name}
                                    onChange={handleChange}
                                    fullWidth
                                    disabled={loading}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <InputLabel htmlFor="size">
                                    Company Size
                                </InputLabel>
                            </Grid>
                            <Grid item xs={12} sm={9}>
                                <TextField
                                    id="size"
                                    name="size"
                                    placeholder="The number of employees in your company"
                                    size="small"
                                    type="number"
                                    value={profile.size}
                                    onChange={handleChange}
                                    fullWidth
                                    disabled={loading}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <InputLabel htmlFor="industry">
                                    Industry Field
                                </InputLabel>
                            </Grid>
                            <Grid item xs={12} sm={9}>
                                <TextField
                                    id="industry"
                                    name="industry"
                                    placeholder="The field of industry which best describes your company."
                                    size="small"
                                    value={profile.industry}
                                    onChange={handleChange}
                                    fullWidth
                                    disabled={loading}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}></Grid>
                            <Grid item xs={12} sm={9}>
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        variant="contained"
                                        disableElevation
                                        fullWidth
                                        type="submit"
                                        disabled={loading}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        disableElevation
                                        fullWidth
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                        <div></div>
                    </div>
                </Stack>
                <ConfirmDialog
                    title="Message"
                    message="Company information updated successfully!"
                    showDialog={showDialog}
                    actions={[
                        {
                            title: "Close",
                            action: () => {
                                setShowDialog(false);
                            },
                            color: "primary",
                            primary: true,
                        },
                    ]}
                />
            </div>
        </Container>
    );
}

export default CompanyProfileForm;
