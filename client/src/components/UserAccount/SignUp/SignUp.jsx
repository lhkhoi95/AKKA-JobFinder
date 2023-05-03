import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

import { Link, useNavigate } from "react-router-dom";
import logoImg from "../../../assets/app-logo.svg";

import AuthenticationServices from "../../../services/AuthenticationServices";

/**
 * A component to display Sign Up page
 */
function SignUp({ isRecruiter }) {
    let navigate = useNavigate();

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: "",
    });

    // Handle event when a text field value changed
    const handleChange = (e) => {
        setErrorMessage("");
        const { name, value } = e.target;
        setLoginInfo({
            ...loginInfo,
            [name]: value,
        });
    };

    // Handle event when Submit button clicked
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        if (validate()) {
            const userInfo = {
                ...loginInfo,
                role: isRecruiter ? "recruiter" : "candidate",
            };
            AuthenticationServices.signUp(userInfo).then((response) => {
                setLoading(false);
                if (response.status === 400) {
                    setErrorMessage(response.data.message);
                }
                if (response.status === 201) {
                    setErrorMessage("");
                    setSuccessMessage(
                        "Account created successfully. Redirecting to login page."
                    );
                    setTimeout(() => {
                        navigate("/account/login");
                    }, 1000);
                }
            });
        } else {
            setLoading(false);
        }
    };

    // Method to validate the password
    const validate = () => {
        if (loginInfo.password.length < 8 || loginInfo.password.length > 16) {
            setErrorMessage("Password must be 8-16 characters.");
            return false;
        } else {
            setErrorMessage("");
            return true;
        }
    };

    return (
        <>
            <Backdrop
                sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Grid container className="signin-container">
                <Grid item xs={0} md={6} alignItems="center">
                    <Grid container>
                        <Grid item>
                            <Stack
                                alignItems="center"
                                justifyContent="center"
                                className="left-wizard-container"
                            >
                                <img src={logoImg} className="logo-img" />
                                <Typography variant="h4" fontWeight="bold">
                                    {isRecruiter
                                        ? "Find the talents that fit your company needs"
                                        : "Find the job that best describes you"}
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Stack
                        className="right-wizard-container"
                        justifyContent={{ sm: "flex-start", md: "center" }}
                    >
                        <Typography variant="h4" fontWeight="bold">
                            {isRecruiter
                                ? "Create a Recruiter Account"
                                : "Create an Account"}
                        </Typography>
                        <Typography variant="h6">
                            {isRecruiter
                                ? "Your next talent pool is here!"
                                : "Your next career opportunity start here!"}
                        </Typography>
                        <Stack
                            component="form"
                            spacing={2}
                            style={{ paddingTop: "32px" }}
                            onSubmit={handleSubmit}
                        >
                            <Stack>
                                <InputLabel htmlFor="email">
                                    Email Address
                                </InputLabel>
                                <TextField
                                    variant="standard"
                                    id="email"
                                    name="email"
                                    placeholder="name@domain.com"
                                    type="email"
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </Stack>
                            <Stack>
                                <InputLabel htmlFor="password">
                                    Password
                                </InputLabel>
                                <TextField
                                    variant="standard"
                                    id="password"
                                    name="password"
                                    type={passwordVisible ? "text" : "password"}
                                    placeholder="8-12 characters"
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton
                                                onClick={() => {
                                                    setPasswordVisible(
                                                        !passwordVisible
                                                    );
                                                }}
                                            >
                                                {passwordVisible ? (
                                                    <VisibilityRoundedIcon />
                                                ) : (
                                                    <VisibilityOffRoundedIcon />
                                                )}
                                            </IconButton>
                                        ),
                                    }}
                                    inputProps={{ maxLength: 12 }}
                                />
                            </Stack>
                            <Button
                                type="submit"
                                variant="contained"
                                disableElevation
                                disabled={loading}
                            >
                                Sign Up
                            </Button>
                            <Alert
                                severity="success"
                                sx={{
                                    display:
                                        successMessage.length > 0
                                            ? "flex"
                                            : "none",
                                }}
                            >
                                {successMessage}
                            </Alert>
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
                            <Stack
                                direction="row"
                                spacing={1}
                                justifyContent="center"
                            >
                                <Typography>
                                    Already have an account?
                                </Typography>
                                <Link
                                    to="/account/login"
                                    className=".uncolored-link"
                                >
                                    Login
                                </Link>
                            </Stack>
                            <Divider />
                            <Button
                                variant="outlined"
                                disableElevation
                                className="google-button"
                                onClick={() => {
                                    isRecruiter
                                        ? navigate("/account/signup")
                                        : navigate("/account/recruiter-signup");
                                }}
                                disabled={loading}
                            >
                                Create an Account as a{" "}
                                {isRecruiter ? "Candidate" : "Recruiter"}
                            </Button>
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
}

export default SignUp;
