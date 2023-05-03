import React, { useContext, useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import ContactPhoneRoundedIcon from "@mui/icons-material/ContactPhoneRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

import { UserContext } from "../../../providers/AuthProvider";

import CandidateServices from "../../../services/CandidateServices";
import moment from "moment";

/**
 * A component to render a Candidate Profile View
 */
function ProfileView(props) {
    const { user } = useContext(UserContext);

    const { editable, candidateProfile } = props;

    const [profile, setProfile] = useState({
        userProfile: {},
        skills: [],
        educations: [],
        experiences: [],
    });

    /**
     * Function to load a candidate profile
     * If the candidate profile is supplied by its parent component,
     * render the profile using the supplied object.
     * Otherwise, get the current user profile from the server
     */
    const loadProfile = async () => {
        if (candidateProfile != null) {
            setProfile({
                ...profile,
                userProfile: { ...candidateProfile.profile },
                educations: [...candidateProfile.educations],
                skills: [...candidateProfile.skills],
                experiences: [...candidateProfile.workExperiences],
            });
        } else {
            const profileRes = await CandidateServices.getCandidateProfile();

            if (profileRes) {
                console.log(profileRes);
                setProfile({
                    ...profile,
                    userProfile: { ...profileRes.profile },
                    skills: [...profileRes.skills],
                    educations: [...profileRes.educations],
                    experiences: [...profileRes.workExperiences],
                });
            }
        }
    };

    useEffect(() => {
        loadProfile();
    }, [user]);

    return (
        <>
            <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h4" color="primary" fontWeight="bold">
                        {profile.userProfile.fullName}
                    </Typography>
                    {user && user.role === "candidate" && editable && (
                        <Button
                            variant="contained"
                            disableElevation
                            href="/candidate/build-profile"
                        >
                            Update Profile
                        </Button>
                    )}
                </Stack>
                <Typography>{profile.userProfile.bio}</Typography>
                <ContactInfoSection
                    profile={profile.userProfile}
                    editable={editable}
                />
                <ResumeSection
                    resumeUrl={profile.userProfile.resumeUrl}
                    editable={editable}
                />
                <SkillsSection skills={profile.skills} editable={editable} />
                <EducationSection
                    educations={profile.educations}
                    editable={editable}
                />
                <ExperienceSection
                    experiences={profile.experiences}
                    editable={editable}
                />
            </Stack>
        </>
    );
}

/**
 * Basic User Information Section
 */
const ContactInfoSection = (props) => {
    const { profile, editable } = props;

    return (
        <>
            <Stack direction="row" alignItems="center" spacing={2}>
                <ContactPhoneRoundedIcon />
                <Typography variant="h5" fontWeight="bold">
                    Contact Information
                </Typography>
            </Stack>

            <Card variant="outlined" sx={{ p: 2 }}>
                <Grid container>
                    <Grid item xs={12} sm={4}>
                        <Stack
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="center"
                            spacing={2}
                        >
                            <LocationOnOutlinedIcon fontSize="small" />
                            <span>{profile.location}</span>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Stack
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="center"
                            spacing={2}
                        >
                            <PhoneOutlinedIcon fontSize="small" />
                            <span>{profile.phoneNumber}</span>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Stack
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="center"
                            spacing={2}
                        >
                            <EmailOutlinedIcon fontSize="small" />
                            <span>{profile.email}</span>
                        </Stack>
                    </Grid>
                </Grid>
            </Card>
        </>
    );
};

/**
 * Skills Section
 */
const SkillsSection = (props) => {
    const { skills, editable } = props;

    return (
        <>
            <Stack direction="row" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={2}>
                    <AutoAwesomeRoundedIcon />
                    <Typography variant="h5" fontWeight="bold">
                        Skills
                    </Typography>
                </Stack>

                {editable && (
                    <Button
                        variant="text"
                        startIcon={<AutoFixHighOutlinedIcon />}
                        href="/candidate/build-profile/3"
                    >
                        Update
                    </Button>
                )}
            </Stack>

            <Card variant="outlined" sx={{ p: 2 }}>
                {skills.map((skill) => (
                    <Chip
                        variant="outlined"
                        key={skill.id}
                        label={skill.name}
                        sx={{ mr: 2, mt: 0.5, mb: 0.5 }}
                    />
                ))}
            </Card>
        </>
    );
};

/**
 * Education History Section
 */
const EducationSection = (props) => {
    const { educations, editable } = props;

    return (
        <>
            <Stack direction="row" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={2}>
                    <SchoolRoundedIcon />
                    <Typography variant="h5" fontWeight="bold">
                        Education History
                    </Typography>
                </Stack>

                {editable && (
                    <Button
                        variant="text"
                        startIcon={<AutoFixHighOutlinedIcon />}
                        href="/candidate/build-profile/2"
                    >
                        Update
                    </Button>
                )}
            </Stack>
            <Card variant="outlined" sx={{ p: 2 }}>
                {educations.map((item, index) => (
                    <div key={item.schoolId}>
                        {index > 0 && (
                            <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
                        )}
                        <Grid container>
                            <Grid item xs={6}>
                                <Typography fontWeight="bold">
                                    {item.schoolName}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography align="right">
                                    {item.startDate &&
                                        moment(item.startDate).format(
                                            "MMM yyyy"
                                        )}
                                    {item.endDate &&
                                        moment(item.endDate).format(
                                            "- MMM yyyy"
                                        )}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography>
                                    {item.degree + ", " + item.major}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography paragraph={true}>
                                    {item.description}
                                </Typography>
                            </Grid>
                        </Grid>
                    </div>
                ))}
                {educations.length === 0 && (
                    <Typography>No Education History Available</Typography>
                )}
            </Card>
        </>
    );
};

/**
 * Work & Experience Section
 */
const ExperienceSection = (props) => {
    const { experiences, editable } = props;

    return (
        <>
            <Stack direction="row" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={2}>
                    <WorkRoundedIcon />
                    <Typography variant="h5" fontWeight="bold">
                        Work & Experience
                    </Typography>
                </Stack>
                {editable && (
                    <Button
                        variant="text"
                        startIcon={<AutoFixHighOutlinedIcon />}
                        href="/candidate/build-profile/3"
                    >
                        Update
                    </Button>
                )}
            </Stack>

            <Card variant="outlined" sx={{ p: 2 }}>
                {experiences.map((item, index) => (
                    <div key={item.id}>
                        {index > 0 && (
                            <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
                        )}
                        <Grid container>
                            <Grid item xs={6}>
                                <Typography fontWeight="bold">
                                    {item.companyName}
                                    {item.companyLocation}
                                </Typography>
                                <Typography>{item.position}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography align="right">
                                    {item.startDate &&
                                        moment(item.startDate).format(
                                            "MMM yyyy"
                                        )}
                                    {item.currentJob
                                        ? " - Present"
                                        : item.endDate &&
                                          moment(item.endDate).format(
                                              " - MMM yyyy"
                                          )}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography>{item.title}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography paragraph={true}>
                                    {item.description}
                                </Typography>
                            </Grid>
                        </Grid>
                    </div>
                ))}
                {experiences.length === 0 && (
                    <Typography>No Work Experience Available</Typography>
                )}
            </Card>
        </>
    );
};

/**
 * Resume Section
 */
const ResumeSection = (props) => {
    const { resumeUrl, editable } = props;

    return (
        <>
            <Stack direction="row" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={2}>
                    <DescriptionRoundedIcon />
                    <Typography variant="h5" fontWeight="bold">
                        Resume
                    </Typography>
                </Stack>

                {editable && (
                    <Button
                        variant="text"
                        startIcon={<AutoFixHighOutlinedIcon />}
                        href="/candidate/build-profile/4"
                    >
                        Update
                    </Button>
                )}
            </Stack>
            <Card variant="outlined" sx={{ p: 2 }}>
                {resumeUrl ? (
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Stack direction="row" spacing={2}>
                            <InsertDriveFileOutlinedIcon color="primary" />
                            <span>
                                {resumeUrl.split("/").length > 0 &&
                                    resumeUrl.split("/").slice(-1)[0]}
                            </span>
                        </Stack>
                        <Button
                            variant="contained"
                            href={resumeUrl}
                            disableElevation
                            endIcon={<FileDownloadOutlinedIcon />}
                        >
                            Download
                        </Button>
                    </Stack>
                ) : (
                    <>No Resume Available</>
                )}
            </Card>
        </>
    );
};

export default ProfileView;
