import React, { useEffect } from "react";

import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

import CandidateServices from "../../../services/CandidateServices";

function CandidateProfileForm(props) {
    const { userProfile, setUserProfile, loading, setLoading, validateStep } =
        props;

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "phoneNumber") {
            setUserProfile({
                ...userProfile,
                phoneNumber: formatPhoneNumber(value),
            });
        } else {
            setUserProfile({
                ...userProfile,
                [name]: value,
            });
        }
    };

    useEffect(() => {
        setLoading(true);
        CandidateServices.getCandidateProfile().then((response) => {
            setUserProfile({ ...response.profile });
            setTimeout(() => {
                setLoading(false);
            }, 500);
        });
    }, []);

    return (
        <Stack spacing={2}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Hi there,
            </Typography>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Tell us about yourself
            </Typography>
            <Grid
                container
                spacing={2}
                className={["profile-form-container", "container"].join(" ")}
            >
                <Grid item xs={12}>
                    <Stack spacing={1}>
                        <InputLabel htmlFor="fullName">Full Name</InputLabel>
                        <TextField
                            placeholder="What is your full name?"
                            id="fullName"
                            name="fullName"
                            size="small"
                            value={userProfile.fullName}
                            required
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                        <InputLabel htmlFor="phoneNumber">
                            Phone Number
                        </InputLabel>
                        <TextField
                            placeholder="(___) ___-____"
                            id="phoneNumber"
                            name="phoneNumber"
                            size="small"
                            value={userProfile.phoneNumber}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                        <InputLabel htmlFor="location">Location</InputLabel>
                        <TextField
                            placeholder="City, Zipcode"
                            id="location"
                            name="location"
                            size="small"
                            value={userProfile.location}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <Stack spacing={1}>
                        <InputLabel htmlFor="bio">Bio</InputLabel>
                        <TextField
                            placeholder="A brief introduction of yourself, this will be displayed on your profile"
                            name="bio"
                            size="small"
                            value={userProfile.bio}
                            multiline
                            rows={2}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </Stack>
                </Grid>
            </Grid>
        </Stack>
    );
}

/**
 * Credit to Thomas Duffy https://tomduffytech.com/how-to-format-phone-number-in-react/
 */
function formatPhoneNumber(value) {
    // if input value is falsy eg if the user deletes the input, then just return
    if (!value) return value;

    // clean the input for any non-digit values.
    const phoneNumber = value.replace(/[^\d]/g, "");

    // phoneNumberLength is used to know when to apply our formatting for the phone number
    const phoneNumberLength = phoneNumber.length;

    // we need to return the value with no formatting if its less then four digits
    // this is to avoid weird behavior that occurs if you  format the area code to early
    if (phoneNumberLength < 4) return phoneNumber;

    // if phoneNumberLength is greater than 4 and less the 7 we start to return
    // the formatted number
    if (phoneNumberLength < 7) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }

    // finally, if the phoneNumberLength is greater then seven, we add the last
    // bit of formatting and return it.
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
        3,
        6
    )}-${phoneNumber.slice(6, 10)}`;
}

export default CandidateProfileForm;
