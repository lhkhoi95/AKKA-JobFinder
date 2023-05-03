import React, { useState, useContext, useEffect } from "react";

import Container from "@mui/material/Container";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import { UserContext } from "../../../providers/AuthProvider";
import CandidateProfileForm from "./CandidateProfileForm";
import CandidateServices from "../../../services/CandidateServices";
import EducationHistoryForm from "./EducationHistoryForm";
import SkillsExperienceForm from "./SkillsExperienceForm";
import ProfileView from "./ProfileView";
import ResumeForm from "./ResumeForm";

import { useParams, useNavigate } from "react-router-dom";

function ProfileForm(props) {
    const navigate = useNavigate();

    const { step } = useParams();

    const { user } = useContext(UserContext);

    const [loading, setLoading] = useState(false);

    const [userProfile, setUserProfile] = useState({
        fullName: "",
        phoneNumber: "",
        location: "",
        bio: "",
        resumeUrl: "",
    });

    const [educationItems, setEducationItems] = useState([
        {
            schoolId: null,
            schoolName: "",
            degree: "",
            major: "",
            startDate: null,
            endDate: null,
            description: "",
        },
    ]);

    const [skills, setSkills] = useState([]);
    const [experienceItems, setExperienceItems] = useState([
        {
            id: null,
            position: "",
            companyName: "",
            startDate: null,
            endDate: null,
            currentJob: false,
            description: "",
            location: "",
        },
    ]);

    const [activeStep, setActiveStep] = useState(0);

    const totalSteps = () => {
        return steps.length;
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep(activeStep - 1);
        }
    };

    const handleNext = () => {
        setLoading(true);

        switch (activeStep) {
            case 0:
                CandidateServices.updateCandidateProfile(userProfile).then(
                    (response) => {
                        console.log(response);
                        moveNext();
                    }
                );
                break;
            case 1:
                const invalidEducationItems = educationItems.filter(
                    (item) =>
                        item.startDate &&
                        item.endDate &&
                        item.startDate > item.endDate
                );
                if (invalidEducationItems.length === 0) {
                    CandidateServices.saveEducationHistory(educationItems).then(
                        (response) => {
                            console.log(response);
                            moveNext();
                        }
                    );
                } else {
                    setLoading(false);
                }
                break;
            case 2:
                const invalidExperienceItems = experienceItems.filter(
                    (item) =>
                        item.currentJob === false &&
                        item.startDate &&
                        item.endDate &&
                        item.startDate > item.endDate
                );
                if (invalidExperienceItems.length === 0) {
                    CandidateServices.saveWorkHistory(experienceItems).then(
                        (response) => {
                            console.log(response);
                            moveNext();
                        }
                    );
                } else {
                    setLoading(false);
                }
                break;
            case 3:
                moveNext();
                break;
            case 4:
                navigate("/candidate/profile");
                break;
        }
    };

    const moveNext = () => {
        setTimeout(() => {
            if (activeStep < totalSteps() - 1) {
                setActiveStep(activeStep + 1);
            }
            setLoading(false);
        }, 500);
    };

    const steps = [
        {
            title: "Profile",
            component: (
                <CandidateProfileForm
                    userProfile={userProfile}
                    setUserProfile={setUserProfile}
                    loading={loading}
                    setLoading={setLoading}
                />
            ),
        },
        {
            title: "Education History",
            component: (
                <EducationHistoryForm
                    loading={loading}
                    educationItems={educationItems}
                    setEducationItems={setEducationItems}
                    setLoading={setLoading}
                />
            ),
        },
        {
            title: "Skills & Experience",
            component: (
                <SkillsExperienceForm
                    skills={skills}
                    setSkills={setSkills}
                    experienceItems={experienceItems}
                    setExperienceItems={setExperienceItems}
                    loading={loading}
                    setLoading={setLoading}
                />
            ),
        },
        {
            title: "Resume",
            component: <ResumeForm />,
        },
        {
            title: "Done",
            component: <ReviewSection />,
        },
    ];

    useEffect(() => {
        console.log("CurrentStep", step);
        if (step >= 1 && step <= 5) {
            setActiveStep(parseInt(step) - 1);
        }
    }, []);

    return (
        <>
            <Container maxWidth="md">
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((step) => (
                        <Step key={step.title}>
                            <StepLabel>{step.title}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Box style={{ paddingTop: "32px" }}>
                    {steps[activeStep].component}
                </Box>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    style={{ paddingTop: "16px" }}
                >
                    <Button
                        variant="contained"
                        disableElevation
                        disabled={activeStep === 0 || loading}
                        onClick={handleBack}
                    >
                        Previous
                    </Button>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            disableElevation
                            href="/candidate/profile"
                            type="submit"
                            disabled={loading}
                            sx={{
                                display: isLastStep() ? "none" : "block",
                            }}
                        >
                            Skip and Complete Later
                        </Button>
                        <Button
                            variant="contained"
                            disableElevation
                            sx={{
                                display: isLastStep() ? "none" : "block",
                            }}
                            onClick={handleNext}
                            type="submit"
                            disabled={loading}
                        >
                            Save and Continue
                        </Button>
                        {isLastStep() && (
                            <Button
                                variant="contained"
                                disableElevation
                                onClick={handleNext}
                                sx={{ ml: 2 }}
                                disabled={loading}
                            >
                                Done
                            </Button>
                        )}
                    </Stack>
                </Stack>
            </Container>
            <Backdrop
                sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}

const ReviewSection = (props) => {
    return (
        <Box {...props}>
            <Typography variant="h5" fontWeight="bold">
                Congratulations on completing your profile!
            </Typography>
            <Typography>
                Below is the preview of how your profile will be presented to
                impress recruiters
            </Typography>
            <Divider style={{ margin: 2 }} />
            <ProfileView editable={false} />
        </Box>
    );
};

export default ProfileForm;
