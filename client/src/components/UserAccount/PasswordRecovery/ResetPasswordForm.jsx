import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import logoImg from "../../../assets/app-logo.svg";
import AuthenticationServices from "../../../services/AuthenticationServices";
import ConfirmDialog from "../../Utils/ConfirmDialog";

function ResetPasswordForm(props) {
    document.title = "AKKA - Reset Password";
    const navigate = useNavigate();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [passwords, setPasswords] = useState({
        newPassword: "",
        confirmPassword: "",
        showNewPassword: false,
        showConfirmPassword: false,
    });

    const [errorMessage, setErrorMessage] = useState("");

    // Toggle show/hide password field
    const handleShowPassword = (currentPassword) => {
        if (currentPassword) {
            setPasswords({
                ...passwords,
                showNewPassword: !passwords.showNewPassword,
            });
        } else {
            setPasswords({
                ...passwords,
                showConfirmPassword: !passwords.showConfirmPassword,
            });
        }
    };

    // Handle event when the form is submitted
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setShowDialog(false);
        setErrorMessage("");
        if (validate()) {
            // Get the change password token from the url
            let token = new URLSearchParams(window.location.search).get(
                "token"
            );

            if (token) {
                // Send the request to reset password with the token
                AuthenticationServices.resetPassword(
                    passwords.newPassword,
                    token
                ).then((response) => {
                    if (response.status === 200) {
                        setShowDialog(true);
                    }
                    if (response.status === 400) {
                        setErrorMessage(response.data.message);
                    }
                });
            } else {
                setErrorMessage("Invalid token. Please try again.");
            }
        }
        setLoading(false);
    };

    // Handle event when the passworld fields' values changed
    const handleChange = (e) => {
        const { name, value } = e.target;
        setErrorMessage("");
        setPasswords({
            ...passwords,
            [name]: value,
        });
    };

    // Validate password fields
    const validate = () => {
        if (passwords.newPassword === passwords.confirmPassword) {
            setErrorMessage("");
            return true;
        } else {
            setErrorMessage("New Password and Confirm Password do not match.");
            return false;
        }
    };

    return (
        <Stack
            sx={{ minHeight: "100vh" }}
            alignItems="center"
            justifyContent="center"
            className="signin-container"
        >
            <img src={logoImg} style={{ width: fullScreen ? "30%" : "25%" }} />
            <Container maxWidth="md">
                <Stack
                    spacing={2}
                    className="forgot-password-form"
                    component="form"
                    onSubmit={handleSubmit}
                >
                    <Typography variant="h5" fontWeight={600}>
                        Set New Password
                    </Typography>
                    <InputLabel htmlFor="newPassword">New Password</InputLabel>
                    <TextField
                        id="newPassword"
                        name="newPassword"
                        variant="outlined"
                        size="small"
                        placeholder="New password, 8-12 characters"
                        fullWidth
                        value={passwords.newPassword}
                        onChange={handleChange}
                        type={passwords.showNewPassword ? "text" : "password"}
                        required
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={() => {
                                        handleShowPassword(true);
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
                        disabled={loading}
                    />
                    <InputLabel htmlFor="confirmPassword">
                        Confirm Password
                    </InputLabel>
                    <TextField
                        id="confirmPassword"
                        name="confirmPassword"
                        variant="outlined"
                        size="small"
                        placeholder="Confirm password"
                        fullWidth
                        value={passwords.confirmPassword}
                        onChange={handleChange}
                        type={
                            passwords.showConfirmPassword ? "text" : "password"
                        }
                        required
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={() => {
                                        handleShowPassword(false);
                                    }}
                                >
                                    {passwords.showConfirmPassword ? (
                                        <VisibilityOffRoundedIcon />
                                    ) : (
                                        <VisibilityRoundedIcon />
                                    )}
                                </IconButton>
                            ),
                        }}
                        inputProps={{ maxLength: 12 }}
                        error={
                            passwords.newPassword.length > 0 &&
                            passwords.confirmPassword.length > 0 &&
                            passwords.newPassword !== passwords.confirmPassword
                        }
                        disabled={loading}
                    />
                    <Alert
                        severity="error"
                        sx={{
                            display: errorMessage.length > 0 ? "flex" : "none",
                        }}
                    >
                        {errorMessage}
                    </Alert>
                    <Button
                        type="submit"
                        variant="contained"
                        disableElevation
                        disabled={loading}
                    >
                        Update Password
                    </Button>
                    <Button disabled={loading} href="/">
                        Cancel
                    </Button>
                </Stack>
            </Container>
            <ConfirmDialog
                title="Message"
                message="Password updated successfully."
                showDialog={showDialog}
                actions={[
                    {
                        title: "Close",
                        primary: true,
                        color: "primary",
                        action: () => {
                            setShowDialog(false);
                            navigate("/account/login");
                        },
                    },
                ]}
            />
        </Stack>
    );
}

export default ResetPasswordForm;
