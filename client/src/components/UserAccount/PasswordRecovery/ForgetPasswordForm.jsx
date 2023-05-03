import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import logoImg from "../../../assets/app-logo.svg";
import AuthenticationServices from "../../../services/AuthenticationServices";
import ConfirmDialog from "../../Utils/ConfirmDialog";

function ForgetPasswordForm(props) {
    document.title = "AKKA - Forgot Password";
    const theme = useTheme();
    const navigate = useNavigate();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
    const [email, setEmail] = useState("");
    const [showDialog, setShowDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle event when the form is submitted
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Send recover password request to the server
        AuthenticationServices.requestRecoverPassword(email).then(
            (response) => {
                if (response.status === 404) {
                    setErrorMessage(response.data.message);
                } else {
                    setShowDialog(true);
                }
                setLoading(false);
            }
        );
    };

    // Bind the new email value
    const handleChange = (e) => {
        const { value } = e.target;
        setEmail(value);
    };

    return (
        <Stack
            sx={{ minHeight: "100vh" }}
            alignItems="center"
            justifyContent={fullScreen ? "flex-start" : "center"}
            className={fullScreen ? "" : "signin-container"}
        >
            <img src={logoImg} style={{ width: fullScreen ? "30%" : "25%" }} />
            <Stack
                spacing={2}
                className="forgot-password-form"
                component="form"
                onSubmit={handleSubmit}
            >
                <Typography variant="h5" fontWeight={600}>
                    Forgot Password?
                </Typography>
                <Typography variant="subtitle1">
                    Enter the email address you signed up with us to recover
                    your password.
                </Typography>
                <TextField
                    name="email"
                    size="small"
                    type="email"
                    placeholder="Email address"
                    onChange={handleChange}
                    required
                    error={errorMessage.length > 0}
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
                    Reset Password
                </Button>
                <Button href="/account/login">Cancel</Button>
            </Stack>
            <ConfirmDialog
                title="Message"
                message="Please check your registered email for a link to reset your password."
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
        </Stack>
    );
}
export default ForgetPasswordForm;
