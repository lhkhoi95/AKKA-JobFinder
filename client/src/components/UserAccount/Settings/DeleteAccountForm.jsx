import React, { useState, useContext } from "react";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import ConfirmDialog from "../../Utils/ConfirmDialog";
import AuthenticationServices from "../../../services/AuthenticationServices";
import { UserContext } from "../../../providers/AuthProvider";

/**
 * A component to display the Delete Account form
 */
function DeleteAccountForm(props) {
    const { signOut } = useContext(UserContext);

    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [password, setPassword] = useState({
        value: "",
        showPassword: false,
    });

    // Handling event when a text field value changed
    const handleChange = (e) => {
        const { value } = e.target;
        setPassword({ ...password, value: value });
        setErrorMessage("");
    };

    // Toggle show/hide password
    const handleShowPassword = () => {
        setPassword({ ...password, showPassword: !password.showPassword });
    };

    // Handle event when the Delete button clicked
    const handleSubmit = (e) => {
        e.preventDefault();
        setShowDeleteDialog(true);
    };

    // Deleting account
    const deleteAccount = () => {
        setLoading(true);
        setShowDeleteDialog(false);
        setShowDialog(false);
        // Send delete account request to the server
        AuthenticationServices.deleteAccount(password.value).then(
            (response) => {
                // Error
                if (response.status === 401) {
                    setErrorMessage(response.data.message);
                }
                // Success
                if (response.status === 200) {
                    setErrorMessage("");
                    setShowDialog(true);
                }
                setLoading(false);
            }
        );
    };

    return (
        <Stack {...props}>
            <Typography>
                This will make your account permanently unusable. This action is
                irreversable. To continue, please enter your password.
            </Typography>
            <Grid
                container
                alignItems="center"
                spacing={2}
                component="form"
                onSubmit={handleSubmit}
            >
                <Grid item xs={12} sm={4}>
                    <InputLabel htmlFor="deletePassword" required>
                        Current Password
                    </InputLabel>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <TextField
                        id="deletePassword"
                        name="deletePassword"
                        variant="outlined"
                        size="small"
                        placeholder="Enter your current password"
                        fullWidth
                        value={password.value}
                        onChange={handleChange}
                        type={password.showPassword ? "text" : "password"}
                        required
                        disabled={loading}
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={handleShowPassword}>
                                    {password.showPassword ? (
                                        <VisibilityRoundedIcon />
                                    ) : (
                                        <VisibilityOffRoundedIcon />
                                    )}
                                </IconButton>
                            ),
                        }}
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
                        color="error"
                        disableElevation
                        type="submit"
                        disabled={loading}
                    >
                        Delete Account
                    </Button>
                </Grid>
            </Grid>
            <ConfirmDialog
                title="Confirm"
                message="Are you sure you want to delete your account?"
                showDialog={showDeleteDialog}
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
                            deleteAccount();
                        },
                    },
                ]}
            />
            <ConfirmDialog
                title="Message"
                message="Your account and related data has been deleted successfully. You will be redirected to the home page."
                showDialog={showDialog}
                actions={[
                    {
                        title: "Close",
                        primary: true,
                        color: "primary",
                        action: () => {
                            setShowDialog(false);
                            signOut();
                        },
                    },
                ]}
            />
        </Stack>
    );
}

export default DeleteAccountForm;
