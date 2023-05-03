import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import MembershipServices from "../../services/MembershipServices";
import moment from "moment";
import ConfirmDialog from "../Utils/ConfirmDialog";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function ManageMembership(props) {
    document.title = "AKKA - Manage Memberships";

    const [loading, setLoading] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showMessageDialog, setShowMessageDialog] = useState(false);
    const [message, setMessage] = useState("");

    const plans = [
        { type: "Monthly", price: 20.0, unit: "/month" },
        { type: "Semi-Annual", price: 100.0, unit: "/6 months" },
        { type: "Annual", price: 180.0, unit: "/year" },
    ];

    const benefits = [
        "Post/Update job listings",
        "Process applications",
        "Search talents",
        "View candidate profiles",
    ];

    const [membershipInfo, setMembershipInfo] = useState(null);
    const [error, setError] = useState(false);

    const [selectedPlan, setSelectedPlan] = useState("");

    let numeral = require("numeral");

    const handlePlanSelected = (e) => {
        setSelectedPlan(e.target.value);
    };

    const onUpdateButtonClick = (e) => {
        e.preventDefault();
        setError(false);
        if (selectedPlan) {
            setShowConfirmDialog(true);
        } else {
            setError(true);
        }
    };

    const closeConfirmDialog = () => {
        setShowConfirmDialog(false);
    };

    const handleUpdatePlan = () => {
        setLoading(true);
        setShowConfirmDialog(false);
        const plan = plans.filter((i) => i.type === selectedPlan)[0];
        MembershipServices.addMembership(plan).then((response) => {
            if (response.status === 201 || response.status === 200) {
                loadMembership();
            }
            setMessage(response.data.message);
            setShowMessageDialog(true);
            setLoading(false);
        });
    };

    const loadMembership = () => {
        setLoading(true);
        MembershipServices.getMembership().then((response) => {
            if (response) {
                setMembershipInfo(response);
            }
            setLoading(false);
        });
    };

    useEffect(() => {
        loadMembership();
    }, []);

    return (
        <Stack {...props} spacing={2}>
            <Typography variant="h5" fontWeight={500}>
                Your Membership
            </Typography>
            <div className="profile-form-container">
                {membershipInfo ? (
                    <Grid container sx={{ padding: 2 }} spacing={1}>
                        <Grid item xs={12} sm={4}>
                            <Typography>Current Membership Plan</Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <Typography fontWeight={600}>
                                {membershipInfo.type}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography>Membership Status</Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <Typography fontWeight={600}>
                                {membershipInfo.status}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography>Expiration Date</Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <Typography fontWeight={600}>
                                {moment(membershipInfo.expirationDate).format(
                                    "MMM DD, YYYY"
                                )}
                            </Typography>
                        </Grid>
                    </Grid>
                ) : (
                    <Stack sx={{ padding: 2 }}>
                        <Typography>
                            You have not enrolled in our membership plans.
                        </Typography>
                        <Typography>
                            Please purchase a membership plan to activate your
                            services.
                        </Typography>
                    </Stack>
                )}
            </div>
            <Typography variant="h5" fontWeight={500}>
                Membership Services
            </Typography>
            <div className="profile-form-container">
                <div style={{ padding: "16px" }}>
                    <Typography>
                        The following services are only available to active
                        membership plans.
                    </Typography>
                    <List>
                        {benefits.map((benefit, index) => (
                            <ListItem key={index}>
                                <ListItemIcon>
                                    <CheckCircleIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText>{benefit}</ListItemText>
                            </ListItem>
                        ))}
                    </List>
                </div>
            </div>
            {membershipInfo === null && (
                <>
                    <Typography variant="h5" fontWeight={500}>
                        Purchase Membership
                    </Typography>
                    <div className="profile-form-container">
                        <Grid container sx={{ padding: 2 }} spacing={1}>
                            <Grid item xs={12} sm={4}>
                                <Typography>Membership Plan</Typography>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <FormControl required>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="female"
                                        name="radio-buttons-group"
                                        value={selectedPlan}
                                        onChange={handlePlanSelected}
                                    >
                                        {plans.map((plan, index) => (
                                            <FormControlLabel
                                                key={index}
                                                value={plan.type}
                                                label={
                                                    <>
                                                        {plan.type}{" "}
                                                        {numeral(
                                                            plan.price
                                                        ).format("$0,0.00")}
                                                        {plan.unit}
                                                    </>
                                                }
                                                control={<Radio />}
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={4}></Grid>
                            <Grid item xs={8}>
                                <Alert
                                    severity="error"
                                    sx={{ display: error ? "flex" : "none" }}
                                >
                                    Please select a plan
                                </Alert>
                            </Grid>
                            <Grid item xs={4}></Grid>
                            <Grid item xs={8}>
                                <Button
                                    variant="contained"
                                    disableElevation
                                    disabled={loading}
                                    onClick={onUpdateButtonClick}
                                >
                                    Purchase Plan
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </>
            )}
            <ConfirmDialog
                showDialog={showConfirmDialog}
                title="Confirm"
                message={
                    "Would you like to update your membership to " +
                    selectedPlan +
                    "?"
                }
                actions={[
                    {
                        title: "No",
                        primary: false,
                        color: "primary",
                        action: () => {
                            closeConfirmDialog();
                        },
                    },
                    {
                        title: "Yes",
                        primary: true,
                        color: "primary",
                        action: () => {
                            handleUpdatePlan();
                        },
                    },
                ]}
            />
            <ConfirmDialog
                showDialog={showMessageDialog}
                title="Message"
                message={message}
                actions={[
                    {
                        title: "Close",
                        primary: true,
                        color: "primary",
                        action: () => {
                            setShowMessageDialog(false);
                        },
                    },
                ]}
            />
        </Stack>
    );
}
export default ManageMembership;
