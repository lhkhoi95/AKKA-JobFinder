import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import ConfirmDialog from "../../Utils/ConfirmDialog";
import AuthenticationServices from "../../../services/AuthenticationServices";

/**
 * A component to display the Update Password Form
 */
function UpdatePasswordForm(props) {
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        showCurrentPassword: false,
        showNewPassword: false,
    });

    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Handling event when a text field value changed
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords({
            ...passwords,
            [name]: value,
        });
    };

    // Toggle show/hide password fields
    const handleShowPassword = (currentPassword) => {
        if (currentPassword) {
            setPasswords({
                ...passwords,
                showCurrentPassword: !passwords.showCurrentPassword,
            });
        } else {
            setPasswords({
                ...passwords,
                showNewPassword: !passwords.showNewPassword,
            });
        }
    };

    // Handle event when the form is submitted
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        AuthenticationServices.updatePassword(
            passwords.currentPassword,
            passwords.newPassword
        ).then((response) => {
            if (response.status === 400) {
                // Display error
                setErrorMessage(response.data.message);
            }
            if (response.status === 201) {
                // Update password success
                setErrorMessage("");
                setShowDialog(true);
            }
            setLoading(false);
        });
    };

    return (
        <>
            <Grid
                container
                alignItems="center"
                spacing={2}
                component="form"
                onSubmit={handleSubmit}
            >
                <Grid item xs={12} sm={4}>
                    <InputLabel htmlFor="currentPassword">
                        Current Password
                    </InputLabel>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <TextField
                        id="currentPassword"
                        name="currentPassword"
                        variant="outlined"
                        size="small"
                        placeholder="Current password"
                        fullWidth
                        value={passwords.currentPassword}
                        onChange={handleChange}
                        type={
                            passwords.showCurrentPassword ? "text" : "password"
                        }
                        required
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={() => {
                                        handleShowPassword(true);
                                    }}
                                >
                                    {passwords.showCurrentPassword ? (
                                        <VisibilityOffRoundedIcon />
                                    ) : (
                                        <VisibilityRoundedIcon />
                                    )}
                                </IconButton>
                            ),
                        }}
                        inputProps={{ maxLength: 12 }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <InputLabel htmlFor="newPassword">New Password</InputLabel>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <TextField
                        id="newPassword"
                        name="newPassword"
                        variant="outlined"
                        size="small"
                        placeholder="New password, 8-12 characters"
                        autoComplete="new-password"
                        fullWidth
                        value={passwords.newPassword}
                        onChange={handleChange}
                        type={passwords.showNewPassword ? "text" : "password"}
                        required
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={() => {
                                        handleShowPassword(false);
                                    }}
                                >
                                    {passwords.showNewPassword ? (
                                        <VisibilityOffRoundedIcon />
                                    ) : (
                                        <VisibilityRoundedIcon />
                                    )}
                                </IconButton>
                            ),
                        }}
                        inputProps={{ maxLength: 12 }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}></Grid>
                <Grid item xs={12} sm={8}>
                    <Alert
                        severity="error"
                        sx={{
                            display: errorMessage.length > 0 ? "flex" : "none",
                        }}
                    >
                        {errorMessage}
                    </Alert>
                </Grid>
                <Grid item xs={12} sm={4}></Grid>
                <Grid item xs={12} sm={8}>
                    <Button variant="contained" disableElevation type="submit">
                        Update Password
                    </Button>
                </Grid>
            </Grid>
            <ConfirmDialog
                title="Message"
                message="Password updated successfully!"
                showDialog={showDialog}
                actions={[
                    {
                        title: "Close",
                        primary: true,
                        color: "primary",
                        action: () => {
                            setShowDialog(false);
                        },
                    },
                ]}
            />
        </>
    );
}

export default UpdatePasswordForm;
