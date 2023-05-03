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
 * A component to display the Update Email Address Form
 */
function UpdateEmailForm(props) {
    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: "",
        showPassword: false,
    });

    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Handle event when a text field value changed
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo({
            ...loginInfo,
            [name]: value,
        });
    };

    // Toggle show/hide password field
    const handleShowPassword = () => {
        setLoginInfo({ ...loginInfo, showPassword: !loginInfo.showPassword });
    };

    // Handle event when the form is submitted
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        AuthenticationServices.updateEmail(loginInfo).then((response) => {
            if (response.status === 400) {
                // Display error
                setErrorMessage(response.data.message);
            }
            if (response.status === 201) {
                // Email update success
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
                    <InputLabel htmlFor="email">Email Address</InputLabel>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <TextField
                        id="email"
                        name="email"
                        variant="outlined"
                        size="small"
                        placeholder="Email address"
                        fullWidth
                        value={loginInfo.email}
                        onChange={handleChange}
                        type="email"
                        required
                        disabled={loading}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <InputLabel htmlFor="password">Current Password</InputLabel>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <TextField
                        id="password"
                        name="password"
                        variant="outlined"
                        size="small"
                        placeholder="Current password"
                        fullWidth
                        value={loginInfo.password}
                        onChange={handleChange}
                        type={loginInfo.showPassword ? "text" : "password"}
                        required
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={() => {
                                        handleShowPassword();
                                    }}
                                >
                                    {loginInfo.showPassword ? (
                                        <VisibilityRoundedIcon />
                                    ) : (
                                        <VisibilityOffRoundedIcon />
                                    )}
                                </IconButton>
                            ),
                        }}
                        disabled={loading}
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
                    <Button
                        variant="contained"
                        disableElevation
                        type="submit"
                        disabled={loading}
                    >
                        Update Email Address
                    </Button>
                </Grid>
            </Grid>
            <ConfirmDialog
                title="Message"
                message="Email updated successfully!"
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

export default UpdateEmailForm;
