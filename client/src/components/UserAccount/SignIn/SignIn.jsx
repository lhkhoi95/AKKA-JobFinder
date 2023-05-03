import React, { useState, useContext } from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

import { Link, useNavigate } from "react-router-dom";

import logoImg from "../../../assets/app-logo.svg";
import { UserContext } from "../../../providers/AuthProvider";

import AuthenticationServices from "../../../services/AuthenticationServices";

/**
 * A component to display Sign In page
 */
function SignIn({ isRecruiter }) {
    const { signIn } = useContext(UserContext);

    let navigate = useNavigate();

    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: "",
    });

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Handle event when a text field value changed
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo({
            ...loginInfo,
            [name]: value,
        });
    };

    // Handle event when the Login button clicked
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        signIn(loginInfo).then((response) => {
            setTimeout(() => {
                if (response.status === 200) {
                    setLoading(false);
                    setErrorMessage("");
                } else {
                    setErrorMessage(response.response.data.message);
                    setLoading(false);
                }
            }, 1000);
        });
    };

    return (
        <>
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
                            {isRecruiter ? "Recruiter Login" : "Login"}
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
                            autoComplete="false"
                            onSubmit={handleSubmit}
                        >
                            <TextField
                                variant="outlined"
                                id="email"
                                placeholder="Email address"
                                type="email"
                                size="small"
                                name="email"
                                value={loginInfo.email}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                            <TextField
                                variant="outlined"
                                id="password"
                                name="password"
                                type={passwordVisible ? "text" : "password"}
                                placeholder="Password"
                                size="small"
                                value={loginInfo.password}
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
                                                <VisibilityOffRoundedIcon />
                                            ) : (
                                                <VisibilityRoundedIcon />
                                            )}
                                        </IconButton>
                                    ),
                                }}
                            />
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
                            <div style={{ textAlign: "right" }}>
                                <Link
                                    to="/account/forgot-password"
                                    className=".uncolored-link"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                variant="contained"
                                disableElevation
                                disabled={loading}
                            >
                                Login
                            </Button>

                            <Stack
                                direction="row"
                                spacing={1}
                                justifyContent="center"
                            >
                                <Typography>Not registered?</Typography>
                                <div className=".uncolored-link">
                                    <Link to="/account/signup">
                                        Create an Account
                                    </Link>
                                </div>
                            </Stack>
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
}

export default SignIn;
